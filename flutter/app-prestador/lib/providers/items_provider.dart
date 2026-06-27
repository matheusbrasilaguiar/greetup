import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/order_item_model.dart';
import '../services/api_service.dart';
import '../services/socket_service.dart';

class ItemsProvider extends ChangeNotifier {
  final ApiService _api;
  final SocketService _socket;

  List<OrderItemModel> _items = [];
  Timer? _pollTimer;
  bool _loaded = false;

  ItemsProvider(this._api, this._socket);

  List<OrderItemModel> get all => _items;
  bool get loaded => _loaded;

  List<OrderItemModel> byStatus(String status) =>
      _items.where((i) => i.status == status).toList();

  List<OrderItemModel> get pendentes => byStatus('PENDENTE');
  List<OrderItemModel> get emPreparo => byStatus('EM_PREPARO');
  List<OrderItemModel> get prontos => byStatus('PRONTO');
  List<OrderItemModel> get entregues => byStatus('ENTREGUE');

  Future<void> load() async {
    try {
      _items = await _api.listItems();
      _loaded = true;
      notifyListeners();
    } catch (_) {}
  }

  void startListening({int pollIntervalSeconds = 30}) {
    _socket.on('order_created', (data) {
      if (data == null) return;
      final rawItems = data['items'] as List<dynamic>? ?? [];
      final orderId = data['orderId'] as String? ?? data['id'] as String? ?? '';
      final session = data['session'] as Map<String, dynamic>? ?? {};
      final table = session['table'] as Map<String, dynamic>? ?? {};
      final customer = session['customer'] as Map<String, dynamic>?;
      final tableCode = table['code'] as String? ?? '?';
      final customerName = customer?['name'] as String?;

      final newItems = rawItems.map<OrderItemModel>((raw) {
        final product = raw['product'] as Map<String, dynamic>? ?? {};
        return OrderItemModel(
          id: raw['id'] as String? ?? '',
          orderId: orderId,
          status: 'PENDENTE',
          productName: product['name'] as String? ?? raw['productName'] as String? ?? '',
          productCategory: product['category'] as String? ?? '',
          quantity: (raw['quantity'] as num?)?.toInt() ?? 1,
          observations: raw['observations'] as String?,
          tableCode: tableCode,
          customerName: customerName,
          createdAt: DateTime.now(),
        );
      }).toList();

      _items.addAll(newItems);
      notifyListeners();
      _vibrate();
    });

    _socket.on('order_item_status_changed', (data) {
      if (data == null) return;
      final itemId = data['itemId'] as String?;
      final status = data['status'] as String?;
      if (itemId != null && status != null) {
        applyStatusChange(itemId, status);
      }
    });

    _pollTimer = Timer.periodic(Duration(seconds: pollIntervalSeconds), (_) => load());
  }

  void applyStatusChange(String itemId, String status) {
    final idx = _items.indexWhere((i) => i.id == itemId);
    if (idx != -1) {
      _items[idx] = _items[idx].copyWith(status: status);
      notifyListeners();
    }
  }

  Future<void> advanceStatus(OrderItemModel item) async {
    const next = {'PENDENTE': 'EM_PREPARO', 'EM_PREPARO': 'PRONTO'};
    final nextStatus = next[item.status];
    if (nextStatus == null) return;
    applyStatusChange(item.id, nextStatus);
    try {
      await _api.updateItemStatus(item.orderId, item.id, nextStatus);
    } catch (_) {
      applyStatusChange(item.id, item.status);
    }
  }

  Future<void> markDelivered(OrderItemModel item) async {
    applyStatusChange(item.id, 'ENTREGUE');
    try {
      await _api.updateItemStatus(item.orderId, item.id, 'ENTREGUE');
    } catch (_) {
      applyStatusChange(item.id, 'PRONTO');
    }
  }

  Future<void> _vibrate() async {
    try {
      HapticFeedback.mediumImpact();
    } catch (_) {}
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    super.dispose();
  }
}
