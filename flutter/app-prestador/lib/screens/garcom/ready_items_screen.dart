import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/order_item_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/items_provider.dart';
import '../../services/socket_service.dart';
import '../../tokens/gu_colors.dart';
import '../../tokens/gu_type.dart';
import '../../config.dart';

class ReadyItemsScreen extends StatefulWidget {
  const ReadyItemsScreen({super.key});

  @override
  State<ReadyItemsScreen> createState() => _ReadyItemsScreenState();
}

class _ReadyItemsScreenState extends State<ReadyItemsScreen> {
  final Map<String, bool> _checked = {};
  String? _bannerMessage;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      final items = context.read<ItemsProvider>();
      final socket = SocketService();
      socket.connect(AppConfig.gatewayUrl, auth.user!.token);
      items.load();
      items.startListening(pollIntervalSeconds: 15);

      socket.on('order_item_status_changed', (data) {
        if (!mounted) return;
        if (data != null && data['status'] == 'PRONTO') {
          _showBanner('Novo item pronto · Mesa ${data['tableCode'] ?? ''}');
        }
      });
    });
  }

  void _showBanner(String message) {
    setState(() => _bannerMessage = message);
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) setState(() => _bannerMessage = null);
    });
  }

  Map<String, List<OrderItemModel>> _groupByTable(List<OrderItemModel> items) {
    final map = <String, List<OrderItemModel>>{};
    for (final item in items) {
      map.putIfAbsent(item.tableCode, () => []).add(item);
    }
    return map;
  }

  bool _allChecked(List<OrderItemModel> items) =>
      items.every((i) => _checked[i.id] == true);

  @override
  Widget build(BuildContext context) {
    final items = context.watch<ItemsProvider>();
    final prontos = items.prontos;
    final grouped = _groupByTable(prontos);
    final total = prontos.length;
    final mesas = grouped.length;

    return Scaffold(
      backgroundColor: GuColors.cream50,
      body: Column(
        children: [
          // Header escuro
          Container(
            color: GuColors.bordeaux900,
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 14,
              left: 18,
              right: 18,
              bottom: 14,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('EVENTO AO VIVO',
                    style: GuType.caption.copyWith(
                        color: GuColors.champagne, letterSpacing: 0.18)),
                const SizedBox(height: 4),
                Text('Garçom',
                    style: GuType.h1.copyWith(
                        color: GuColors.cream50, fontSize: 22, letterSpacing: -0.022)),
                const SizedBox(height: 4),
                Text(
                  '$mesas ${mesas == 1 ? 'mesa' : 'mesas'} · $total ${total == 1 ? 'item' : 'itens'} aguardando entrega',
                  style: GuType.caption.copyWith(
                      color: GuColors.champagne,
                      fontSize: 10,
                      letterSpacing: 0.12),
                ),
              ],
            ),
          ),

          // Banner de novo item pronto
          if (_bannerMessage != null)
            Container(
              width: double.infinity,
              color: GuColors.bordeaux700,
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
              child: Text(_bannerMessage!,
                  style: GuType.body.copyWith(
                      color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500)),
            ),

          // Lista por mesa
          Expanded(
            child: prontos.isEmpty
                ? _EmptyState()
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: grouped.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (_, i) {
                      final tableCode = grouped.keys.elementAt(i);
                      final tableItems = grouped[tableCode]!;
                      return _TableGroup(
                        tableCode: tableCode,
                        items: tableItems,
                        checked: _checked,
                        allChecked: _allChecked(tableItems),
                        onCheck: (id, val) =>
                            setState(() => _checked[id] = val),
                        onConfirm: () {
                          final prov = context.read<ItemsProvider>();
                          for (final item in tableItems) {
                            prov.markDelivered(item);
                          }
                          setState(() {
                            for (final item in tableItems) {
                              _checked.remove(item.id);
                            }
                          });
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

// ── Grupo de mesa ─────────────────────────────────────────────────────────────

class _TableGroup extends StatelessWidget {
  final String tableCode;
  final List<OrderItemModel> items;
  final Map<String, bool> checked;
  final bool allChecked;
  final void Function(String id, bool val) onCheck;
  final VoidCallback onConfirm;

  const _TableGroup({
    required this.tableCode,
    required this.items,
    required this.checked,
    required this.allChecked,
    required this.onCheck,
    required this.onConfirm,
  });

  @override
  Widget build(BuildContext context) {
    final customer = items.first.customerName;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: GuColors.cream200),
        borderRadius: BorderRadius.circular(12),
      ),
      clipBehavior: Clip.hardEdge,
      child: Column(
        children: [
          // Header da mesa
          Container(
            color: GuColors.cream100,
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Mesa ${tableCode.padLeft(2, '0')}${customer != null ? ' · $customer' : ''}',
                        style: GuType.body.copyWith(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            letterSpacing: -0.01),
                      ),
                      const SizedBox(height: 2),
                      Text('${items.length} ${items.length == 1 ? 'item' : 'itens'}',
                          style: GuType.caption.copyWith(
                              color: GuColors.ink500,
                              fontSize: 9.5,
                              letterSpacing: 0.12)),
                    ],
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: GuColors.bordeaux700,
                    borderRadius: BorderRadius.circular(99),
                  ),
                  child: Text('${items.length} itens',
                      style: GuType.caption.copyWith(
                          color: Colors.white, fontSize: 9.5, letterSpacing: 0.1)),
                ),
              ],
            ),
          ),

          // Itens
          ...items.map((item) => Container(
                decoration: BoxDecoration(
                  border: Border(top: BorderSide(color: GuColors.cream200)),
                ),
                padding:
                    const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                child: Row(
                  children: [
                    Expanded(
                      child: Text.rich(TextSpan(children: [
                        TextSpan(
                          text: '${item.quantity}× ',
                          style: GuType.caption.copyWith(
                              color: GuColors.bordeaux700,
                              fontSize: 11,
                              fontFamily: 'JetBrainsMono',
                              letterSpacing: 0.04),
                        ),
                        TextSpan(
                          text: item.productName,
                          style: GuType.body.copyWith(fontSize: 13),
                        ),
                      ])),
                    ),
                    GestureDetector(
                      onTap: () => onCheck(item.id, !(checked[item.id] ?? false)),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          color: (checked[item.id] ?? false)
                              ? GuColors.bordeaux700
                              : Colors.white,
                          border: Border.all(
                              color: (checked[item.id] ?? false)
                                  ? GuColors.bordeaux700
                                  : GuColors.ink300,
                              width: 1.5),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: (checked[item.id] ?? false)
                            ? const Icon(Icons.check,
                                size: 14, color: Colors.white)
                            : null,
                      ),
                    ),
                  ],
                ),
              )),

          // Footer com botão
          Container(
            decoration: BoxDecoration(
                border: Border(top: BorderSide(color: GuColors.cream200))),
            padding: const EdgeInsets.all(10),
            child: SizedBox(
              width: double.infinity,
              child: GestureDetector(
                onTap: allChecked ? onConfirm : null,
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: allChecked
                        ? GuColors.bordeaux700
                        : GuColors.cream200,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    'Confirmar entrega da mesa',
                    textAlign: TextAlign.center,
                    style: GuType.body.copyWith(
                      color: allChecked ? Colors.white : GuColors.ink500,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
                color: GuColors.cream100, shape: BoxShape.circle),
            child: Icon(Icons.check_circle_outline,
                size: 36, color: GuColors.bordeaux700),
          ),
          const SizedBox(height: 14),
          Text('Nenhum item para entregar',
              style: GuType.h2.copyWith(fontSize: 16, letterSpacing: -0.015)),
          const SizedBox(height: 6),
          Text('Tudo entregue! Aguardando novos pedidos.',
              style: GuType.body.copyWith(
                  color: GuColors.ink500, fontSize: 12),
              textAlign: TextAlign.center),
        ],
      ),
    );
  }
}
