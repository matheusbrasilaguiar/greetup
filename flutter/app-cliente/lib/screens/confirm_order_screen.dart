import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/menu_provider.dart';
import '../providers/order_provider.dart';
import '../providers/session_provider.dart';
import '../tokens/gu_colors.dart';
import '../tokens/gu_type.dart';

class ConfirmOrderScreen extends StatelessWidget {
  final String tableId;
  final String sessionId;
  const ConfirmOrderScreen({super.key, required this.tableId, required this.sessionId});

  Future<void> _confirm(BuildContext context) async {
    final menu   = context.read<MenuProvider>();
    final orders = context.read<OrderProvider>();

    final order = await orders.createOrder(sessionId, menu.cartItems);
    if (order != null && context.mounted) {
      menu.clearCart();
      context.go('/tables/$tableId/account?sessionId=$sessionId');
    }
  }

  @override
  Widget build(BuildContext context) {
    final menu    = context.watch<MenuProvider>();
    final orders  = context.watch<OrderProvider>();
    final session = context.watch<SessionProvider>();
    final current = session.currentSession;

    final eyebrow = [
      current?.tableCode,
      current?.customer?.name,
    ].whereType<String>().join(' · ');

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
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      _CircleBack(onTap: () => context.pop()),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (eyebrow.isNotEmpty)
                              Text(
                                eyebrow.toUpperCase(),
                                style: GuType.caption.copyWith(
                                  color: GuColors.bordeaux700,
                                  letterSpacing: 1.4,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            const SizedBox(height: 2),
                            Text('Revisar pedido', style: GuType.h2),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // ── Conteúdo scrollável ────────────────────────────
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _ReviewCard(items: menu.cartItems),
                        const SizedBox(height: 12),
                        _NoteBox(),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),

                // ── Botões fixos ───────────────────────────────────
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      _PrimaryBtn(
                        label: 'Confirmar pedido',
                        loading: orders.loading,
                        onTap: orders.loading ? null : () => _confirm(context),
                      ),
                      const SizedBox(height: 8),
                      _SecondaryBtn(
                        label: 'Editar itens',
                        onTap: () => context.pop(),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ─── Review card ──────────────────────────────────────────────────────────────

class _ReviewCard extends StatelessWidget {
  final List<CartItem> items;
  const _ReviewCard({required this.items});

  @override
  Widget build(BuildContext context) {
    final total = items.fold<int>(0, (sum, i) => sum + i.quantity);

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: GuColors.cream200),
      ),
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          ...List.generate(items.length, (i) {
            final item = items[i];
            return Column(
              children: [
                _ReviewRow(item: item),
                if (i < items.length - 1)
                  const Divider(color: GuColors.cream200, height: 1),
              ],
            );
          }),

          // Divisor champagne
          Container(
            margin: const EdgeInsets.symmetric(vertical: 8),
            height: 1,
            color: GuColors.champagne,
          ),

          // Total
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'TOTAL DE ITENS',
                style: GuType.caption.copyWith(
                  color: GuColors.ink700,
                  letterSpacing: 1.2,
                ),
              ),
              Text(
                '$total',
                style: GuType.caption.copyWith(
                  color: GuColors.bordeaux700,
                  fontWeight: FontWeight.w500,
                  letterSpacing: 1.2,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ReviewRow extends StatelessWidget {
  final CartItem item;
  const _ReviewRow({required this.item});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '${item.quantity}×',
            style: GuType.caption.copyWith(
              color: GuColors.bordeaux700,
              letterSpacing: 0.5,
              fontSize: 11,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.product.name,
                  style: GuType.bodySm.copyWith(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: GuColors.ink900,
                  ),
                ),
                if (item.notes != null && item.notes!.isNotEmpty)
                  Text(
                    item.notes!.toUpperCase(),
                    style: GuType.caption.copyWith(
                      color: GuColors.ink500,
                      letterSpacing: 0.5,
                      fontSize: 9.5,
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

// ─── Note box ─────────────────────────────────────────────────────────────────

class _NoteBox extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: GuColors.cream100,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.info_outline, size: 13, color: GuColors.ink500),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              'Os itens serão enviados automaticamente para a cozinha e o garçom será notificado quando estiverem prontos.',
              style: GuType.bodySm.copyWith(
                fontSize: 11.5,
                color: GuColors.ink700,
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Botões ───────────────────────────────────────────────────────────────────

class _PrimaryBtn extends StatelessWidget {
  final String label;
  final VoidCallback? onTap;
  final bool loading;
  const _PrimaryBtn({required this.label, this.onTap, this.loading = false});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: onTap != null ? GuColors.bordeaux700 : GuColors.cream200,
          borderRadius: BorderRadius.circular(8),
        ),
        alignment: Alignment.center,
        child: loading
            ? const SizedBox(
                width: 18, height: 18,
                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
              )
            : Text(
                label,
                style: GuType.body.copyWith(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: onTap != null ? Colors.white : GuColors.ink300,
                ),
              ),
      ),
    );
  }
}

class _SecondaryBtn extends StatelessWidget {
  final String label;
  final VoidCallback? onTap;
  const _SecondaryBtn({required this.label, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: GuColors.bordeaux700, width: 1.5),
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          style: GuType.body.copyWith(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: GuColors.bordeaux700,
          ),
        ),
      ),
    );
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

class _CircleBack extends StatelessWidget {
  final VoidCallback onTap;
  const _CircleBack({required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      width: 32, height: 32,
      decoration: const BoxDecoration(
        color: GuColors.cream100,
        shape: BoxShape.circle,
      ),
      child: const Icon(Icons.chevron_left, size: 18, color: GuColors.ink900),
    ),
  );
}
