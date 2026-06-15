import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../models/order_model.dart';
import '../providers/order_provider.dart';
import '../providers/session_provider.dart';
import '../tokens/gu_colors.dart';
import '../tokens/gu_type.dart';
import '../widgets/gu_bottom_bar.dart';
import '../widgets/gu_status_badge.dart';

class ActiveAccountScreen extends StatefulWidget {
  final String tableId;
  final String sessionId;
  const ActiveAccountScreen({super.key, required this.tableId, required this.sessionId});

  @override
  State<ActiveAccountScreen> createState() => _ActiveAccountScreenState();
}

class _ActiveAccountScreenState extends State<ActiveAccountScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<OrderProvider>().loadOrders(widget.sessionId);
      context.read<OrderProvider>().listenToEvents(widget.sessionId);
      context.read<SessionProvider>().loadActiveSession(widget.tableId);
    });
  }

  @override
  void dispose() {
    context.read<OrderProvider>().stopListening();
    super.dispose();
  }

  void _showCloseSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _CloseAccountSheet(
        tableId: widget.tableId,
        sessionId: widget.sessionId,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final orders  = context.watch<OrderProvider>();
    final session = context.watch<SessionProvider>();
    final current = session.currentSession;

    // Achata todos os itens de todos os pedidos em ordem cronológica inversa
    final flatItems = orders.orders
        .expand((o) => o.items.map((item) => _FlatItem(item: item, order: o)))
        .toList();

    return Scaffold(
      backgroundColor: GuColors.cream50,
      body: SafeArea(
        child: Align(
          alignment: Alignment.topCenter,
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 560),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // ── Header ─────────────────────────────────────────
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _eyebrow(current),
                              style: GuType.caption.copyWith(
                                color: GuColors.bordeaux700,
                                letterSpacing: 1.4,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(current?.customer?.name ?? '—', style: GuType.h2),
                          ],
                        ),
                      ),
                      Container(
                        width: 36, height: 36,
                        decoration: const BoxDecoration(
                          color: GuColors.cream100,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.notifications_none_outlined,
                            size: 18, color: GuColors.ink700),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 12),

                // ── Pill ───────────────────────────────────────────
                if (current != null)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: _AcctPill(durationMinutes: current.durationMinutes),
                  ),

                const SizedBox(height: 12),

                // ── Banner de pronto ───────────────────────────────
                if (orders.readyBanner != null)
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 4),
                    child: _ReadyBanner(
                      productName: orders.readyBanner!,
                      tableCode: current?.tableCode,
                    ),
                  ),

                // ── Lista flat ─────────────────────────────────────
                Expanded(
                  child: orders.loading && orders.orders.isEmpty
                      ? const Center(child: CircularProgressIndicator(color: GuColors.bordeaux700))
                      : flatItems.isEmpty
                          ? Center(child: Text('Nenhum pedido ainda.', style: GuType.body))
                          : ListView.separated(
                              padding: const EdgeInsets.fromLTRB(20, 4, 20, 12),
                              itemCount: flatItems.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 8),
                              itemBuilder: (_, i) => _OrderItemCard(flat: flatItems[i]),
                            ),
                ),

                // ── Ações ──────────────────────────────────────────
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      _ActionBtn(
                        label: 'Novo pedido',
                        icon: Icons.add,
                        style: _BtnStyle.secondary,
                        onTap: () => context.push(
                          '/tables/${widget.tableId}/menu?sessionId=${widget.sessionId}',
                        ),
                      ),
                      const SizedBox(height: 8),
                      _ActionBtn(
                        label: 'Fechar conta',
                        style: _BtnStyle.outlineDanger,
                        onTap: _showCloseSheet,
                      ),
                    ],
                  ),
                ),

                // ── Bottom nav ─────────────────────────────────────
                GuAppBottomNav(
                  activeIndex: 0,
                  onMesas: () => context.go('/tables'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _eyebrow(dynamic session) {
    if (session == null) return 'MESA';
    final parts = <String>[
      session.tableCode as String,
      if (session.customer?.employer != null) session.customer!.employer as String,
    ];
    return parts.join(' · ').toUpperCase();
  }
}

// ─── Flat item model ──────────────────────────────────────────────────────────

class _FlatItem {
  final OrderItemModel item;
  final OrderModel order;
  const _FlatItem({required this.item, required this.order});
}

// ─── Componentes ─────────────────────────────────────────────────────────────

class _AcctPill extends StatefulWidget {
  final int durationMinutes;
  const _AcctPill({required this.durationMinutes});

  @override
  State<_AcctPill> createState() => _AcctPillState();
}

class _AcctPillState extends State<_AcctPill>
    with SingleTickerProviderStateMixin {
  late final AnimationController _anim;

  @override
  void initState() {
    super.initState();
    _anim = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _anim.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
          decoration: BoxDecoration(
            color: GuColors.cream100,
            borderRadius: BorderRadius.circular(99),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              FadeTransition(
                opacity: _anim,
                child: Container(
                  width: 5, height: 5,
                  decoration: const BoxDecoration(
                    color: GuColors.bordeaux700,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
              const SizedBox(width: 6),
              Text(
                'Conta aberta há ${widget.durationMinutes} min',
                style: GuType.caption.copyWith(
                  color: GuColors.bordeaux700,
                  letterSpacing: 1.1,
                  fontSize: 9.5,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ReadyBanner extends StatelessWidget {
  final String productName;
  final String? tableCode;
  const _ReadyBanner({required this.productName, this.tableCode});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: GuStatus.ready.bg,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: GuStatus.ready.br),
      ),
      child: Row(
        children: [
          Icon(Icons.check, size: 18, color: GuStatus.ready.br),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '$productName pronto para entrega',
                  style: GuType.bodySm.copyWith(
                    fontWeight: FontWeight.w500,
                    color: GuStatus.ready.tx,
                  ),
                ),
                if (tableCode != null)
                  Text(
                    'Garçom notificado · $tableCode',
                    style: GuType.bodySm.copyWith(
                      fontSize: 11,
                      color: GuColors.ink700,
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _OrderItemCard extends StatelessWidget {
  final _FlatItem flat;
  const _OrderItemCard({required this.flat});

  @override
  Widget build(BuildContext context) {
    final item      = flat.item;
    final order     = flat.order;
    final delivered = item.status == 'ENTREGUE';

    return Opacity(
      opacity: delivered ? 0.7 : 1.0,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: GuColors.cream200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: '${item.quantity}× ',
                          style: GuType.caption.copyWith(
                            color: GuColors.bordeaux700,
                            letterSpacing: 0.6,
                            fontSize: 10,
                          ),
                        ),
                        TextSpan(
                          text: item.product.name,
                          style: GuType.bodySm.copyWith(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            letterSpacing: -0.08,
                            height: 1.3,
                            color: GuColors.ink900,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ItemStatusBadge(status: item.status),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              _timestamp(item.status, order.createdAt),
              style: GuType.caption.copyWith(
                color: GuColors.ink500,
                letterSpacing: 0.6,
                fontSize: 9.5,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _timestamp(String status, DateTime createdAt) {
    final time = TimeOfDay.fromDateTime(createdAt);
    final hh   = time.hour.toString().padLeft(2, '0');
    final mm   = time.minute.toString().padLeft(2, '0');
    if (status == 'ENTREGUE') return 'ENTREGUE ÀS $hh:$mm';
    return 'PEDIDO ÀS $hh:$mm';
  }
}

// ─── Botões de ação ───────────────────────────────────────────────────────────

enum _BtnStyle { secondary, outlineDanger }

class _ActionBtn extends StatelessWidget {
  final String label;
  final IconData? icon;
  final _BtnStyle style;
  final VoidCallback onTap;
  const _ActionBtn({required this.label, required this.style, required this.onTap, this.icon});

  @override
  Widget build(BuildContext context) {
    final isSecondary = style == _BtnStyle.secondary;
    final borderColor = isSecondary ? GuColors.bordeaux700 : GuColors.danger;
    final textColor   = isSecondary ? GuColors.bordeaux700 : GuColors.danger;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: borderColor, width: 1.5),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) ...[
              Icon(icon, size: 13, color: textColor),
              const SizedBox(width: 6),
            ],
            Text(
              label,
              style: GuType.body.copyWith(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: textColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Close account sheet ──────────────────────────────────────────────────────

class _CloseAccountSheet extends StatefulWidget {
  final String tableId;
  final String sessionId;
  const _CloseAccountSheet({required this.tableId, required this.sessionId});

  @override
  State<_CloseAccountSheet> createState() => _CloseAccountSheetState();
}

class _CloseAccountSheetState extends State<_CloseAccountSheet> {
  bool _closing = false;

  Future<void> _close() async {
    setState(() => _closing = true);
    final orders  = context.read<OrderProvider>();
    final session = context.read<SessionProvider>();

    for (final order in orders.openOrders) {
      await orders.closeOrder(order.id);
    }

    final ok = await session.closeSession(widget.tableId, widget.sessionId);
    if (ok && mounted) {
      orders.clear();
      session.clear();
      context.go('/tables');
    } else {
      setState(() => _closing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final orders  = context.watch<OrderProvider>();
    final session = context.watch<SessionProvider>();
    final current = session.currentSession;
    final openCount = orders.openOrders.length;
    final allItems  = orders.orders.expand((o) => o.items).length;

    return Container(
      decoration: const BoxDecoration(
        color: GuColors.cream50,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.fromLTRB(
        22, 8, 22,
        24 + MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Grip
          Center(
            child: Container(
              width: 40, height: 4,
              decoration: BoxDecoration(
                color: GuColors.ink300,
                borderRadius: BorderRadius.circular(99),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Eyebrow + título + parágrafo
          if (current != null)
            Text(
              '${current.tableCode.toUpperCase()} · ${current.durationMinutes} MIN DE ATENDIMENTO',
              style: GuType.caption.copyWith(
                color: GuColors.bordeaux700,
                letterSpacing: 1.3,
              ),
            ),
          const SizedBox(height: 4),
          Text('Fechar atendimento?', style: GuType.h2.copyWith(fontSize: 20)),
          const SizedBox(height: 6),
          Text(
            'O fechamento é apenas para controle — a mesa ficará disponível e o histórico arquivado no relatório do evento.',
            style: GuType.bodySm.copyWith(color: GuColors.ink700, height: 1.5),
          ),
          const SizedBox(height: 14),

          // Resumo
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: GuColors.cream200),
            ),
            child: Column(
              children: [
                _SummaryRow(k: 'ITENS SERVIDOS', v: '$allItems'),
                _SummaryRow(k: 'PEDIDOS', v: '${orders.orders.length}'),
                const Divider(color: GuColors.cream200, height: 16),
                _SummaryRow(
                  k: 'DURAÇÃO',
                  v: '${current?.durationMinutes ?? 0} min',
                  vColor: GuColors.bordeaux700,
                  vMono: true,
                ),
              ],
            ),
          ),

          // Alerta (itens em aberto)
          if (openCount > 0) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFEF4444)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.warning_amber_rounded, size: 16, color: Color(0xFFB91C1C)),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '$openCount ${openCount == 1 ? "item ainda" : "itens ainda"} em aberto',
                          style: GuType.bodySm.copyWith(
                            fontWeight: FontWeight.w500,
                            color: const Color(0xFFB91C1C),
                          ),
                        ),
                        Text(
                          'Serão cancelados automaticamente se você fechar agora.',
                          style: GuType.bodySm.copyWith(
                            fontSize: 12,
                            color: const Color(0xFFB91C1C),
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 14),

          // Botões
          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 13),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      'Cancelar',
                      style: GuType.body.copyWith(
                        fontWeight: FontWeight.w500,
                        color: GuColors.ink700,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: GestureDetector(
                  onTap: _closing ? null : _close,
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 13),
                    decoration: BoxDecoration(
                      color: _closing ? GuColors.cream200 : GuColors.bordeaux700,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    alignment: Alignment.center,
                    child: _closing
                        ? const SizedBox(
                            width: 16, height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          )
                        : Text(
                            'Fechar conta',
                            style: GuType.body.copyWith(
                              fontWeight: FontWeight.w500,
                              color: Colors.white,
                            ),
                          ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final String k;
  final String v;
  final Color? vColor;
  final bool vMono;
  const _SummaryRow({required this.k, required this.v, this.vColor, this.vMono = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            k,
            style: GuType.caption.copyWith(color: GuColors.ink500, letterSpacing: 0.6, fontSize: 10.5),
          ),
          Text(
            v,
            style: vMono
                ? GuType.caption.copyWith(color: vColor ?? GuColors.ink900, letterSpacing: 0, fontWeight: FontWeight.w500, fontSize: 11)
                : GuType.bodySm.copyWith(fontWeight: FontWeight.w500, color: vColor ?? GuColors.ink900),
          ),
        ],
      ),
    );
  }
}
