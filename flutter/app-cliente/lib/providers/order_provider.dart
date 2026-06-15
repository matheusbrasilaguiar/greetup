import 'package:flutter/material.dart';
import '../models/order_model.dart';
import '../providers/menu_provider.dart';
import '../services/api_service.dart';
import '../services/socket_service.dart';

class OrderProvider extends ChangeNotifier {
  List<OrderModel> _orders = [];
  bool _loading = false;
  String? _error;
  String? _readyBanner; // nome do item que ficou pronto

  List<OrderModel> get orders => _orders;
  List<OrderModel> get openOrders =>
      _orders.where((o) => o.status == 'OPEN').toList();
  bool get loading => _loading;
  String? get error => _error;
  String? get readyBanner => _readyBanner;

  Future<void> loadOrders(String sessionId) async {
    _loading = true;
    notifyListeners();

    try {
      final response = await ApiService().dio.get(
        '/orders',
        queryParameters: {'sessionId': sessionId},
      );
      _orders = (response.data as List)
          .map((o) => OrderModel.fromJson(o))
          .toList();
    } catch (_) {
      _error = 'Não foi possível carregar os pedidos.';
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<OrderModel?> createOrder(String sessionId, List<CartItem> items) async {
    _loading = true;
    notifyListeners();

    try {
      final response = await ApiService().dio.post('/orders', data: {
        'sessionId': sessionId,
        'items': items.map((i) => {
          'productId': i.product.id,
          'quantity': i.quantity,
          if (i.notes != null) 'notes': i.notes,
        }).toList(),
      });
      final order = OrderModel.fromJson(response.data);
      _orders.insert(0, order);
      notifyListeners();
      return order;
    } catch (_) {
      _error = 'Não foi possível criar o pedido.';
      return null;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<bool> closeOrder(String orderId) async {
    try {
      final response = await ApiService().dio.patch('/orders/$orderId/close');
      final updated = OrderModel.fromJson(response.data);
      _orders = _orders.map((o) => o.id == orderId ? updated : o).toList();
      notifyListeners();
      return true;
    } catch (_) {
      return false;
    }
  }

  void listenToEvents(String sessionId) {
    SocketService().on('order_item_status_changed', (data) {
      final itemId   = data['itemId'] as String;
      final newStatus = data['status'] as String;
      _orders = _orders
          .map((o) => o.copyWithItemStatus(itemId, newStatus))
          .toList();

      if (newStatus == 'PRONTO') {
        _readyBanner = data['productName'] as String?;
        notifyListeners();
        Future.delayed(const Duration(seconds: 3), () {
          _readyBanner = null;
          notifyListeners();
        });
      } else {
        notifyListeners();
      }
    });

    SocketService().on('order_created', (data) {
      loadOrders(sessionId);
    });
  }

  void stopListening() {
    SocketService().off('order_item_status_changed');
    SocketService().off('order_created');
  }

  void clear() {
    _orders = [];
    _error = null;
    _readyBanner = null;
    notifyListeners();
  }
}
