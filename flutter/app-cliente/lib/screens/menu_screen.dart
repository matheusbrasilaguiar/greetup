import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../models/product_model.dart';
import '../providers/menu_provider.dart';
import '../providers/session_provider.dart';
import '../tokens/gu_colors.dart';
import '../tokens/gu_type.dart';

class MenuScreen extends StatefulWidget {
  final String tableId;
  final String sessionId;
  const MenuScreen({super.key, required this.tableId, required this.sessionId});

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<MenuProvider>().loadProducts();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final menu    = context.watch<MenuProvider>();
    final session = context.watch<SessionProvider>();
    final current = session.currentSession;

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
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            current?.tableCode.toUpperCase() ?? 'MESA',
                            style: GuType.caption.copyWith(
                              color: GuColors.bordeaux700,
                              letterSpacing: 1.6,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(current?.customer?.name ?? 'Cardápio', style: GuType.h2),
                          if (current?.customer?.employer != null)
                            Text(
                              current!.customer!.employer!,
                              style: GuType.bodySm.copyWith(
                                color: GuColors.ink500,
                                fontSize: 11,
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 10),

                // ── Tabs ───────────────────────────────────────────
                _GuTabBar(controller: _tabController),

                // ── Lista + confirm bar ────────────────────────────
                Expanded(
                  child: menu.loading
                      ? const Center(child: CircularProgressIndicator(color: GuColors.bordeaux700))
                      : Stack(
                          children: [
                            TabBarView(
                              controller: _tabController,
                              children: [
                                _ProductList(products: menu.foods),
                                _ProductList(products: menu.drinks),
                              ],
                            ),
                            if (!menu.cartIsEmpty)
                              Positioned(
                                left: 20,
                                right: 20,
                                bottom: 20,
                                child: _ConfirmBar(
                                  count: menu.cartCount,
                                  onTap: () => context.push(
                                    '/tables/${widget.tableId}/confirm?sessionId=${widget.sessionId}',
                                  ),
                                ),
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

// ─── Tab bar ─────────────────────────────────────────────────────────────────

class _GuTabBar extends StatelessWidget {
  final TabController controller;
  const _GuTabBar({required this.controller});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: GuColors.cream200)),
      ),
      child: TabBar(
        controller: controller,
        isScrollable: false,
        indicatorColor: GuColors.bordeaux700,
        indicatorWeight: 2,
        labelColor: GuColors.bordeaux700,
        unselectedLabelColor: GuColors.ink500,
        labelStyle: GuType.body.copyWith(
          fontSize: 13,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.04,
        ),
        unselectedLabelStyle: GuType.body.copyWith(
          fontSize: 13,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.04,
        ),
        tabs: const [Tab(text: 'Comidas'), Tab(text: 'Bebidas')],
      ),
    );
  }
}

// ─── Lista ────────────────────────────────────────────────────────────────────

class _ProductList extends StatelessWidget {
  final List<ProductModel> products;
  const _ProductList({required this.products});

  @override
  Widget build(BuildContext context) {
    if (products.isEmpty) {
      return Center(child: Text('Nenhum item disponível.', style: GuType.body));
    }
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 90),
      itemCount: products.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (_, i) => _ProductCard(product: products[i]),
    );
  }
}

// ─── Card de produto ──────────────────────────────────────────────────────────

class _ProductCard extends StatelessWidget {
  final ProductModel product;
  const _ProductCard({required this.product});

  void _openNotesSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: GuColors.cream50,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(GuRadius.lg)),
      ),
      builder: (_) => _NotesSheet(product: product),
    );
  }

  @override
  Widget build(BuildContext context) {
    final menu  = context.watch<MenuProvider>();
    final qty   = menu.quantityOf(product.id);
    final notes = menu.notesOf(product.id);

    return Container(
      padding: const EdgeInsets.fromLTRB(12, 10, 10, 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: GuColors.cream200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Info
              Expanded(
                child: GestureDetector(
                  onTap: () => _openNotesSheet(context),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        product.name,
                        style: GuType.bodySm.copyWith(
                          fontSize: 13.5,
                          fontWeight: FontWeight.w500,
                          letterSpacing: -0.08,
                          height: 1.25,
                          color: GuColors.ink900,
                        ),
                      ),
                      if (product.description != null) ...[
                        const SizedBox(height: 3),
                        Text(
                          product.description!,
                          style: GuType.bodySm.copyWith(
                            fontSize: 11,
                            color: GuColors.ink500,
                            height: 1.4,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              // Stepper (pill)
              _PillStepper(
                value: qty,
                onDecrement: () => context.read<MenuProvider>().setQuantity(product, qty - 1),
                onIncrement: () => context.read<MenuProvider>().setQuantity(product, qty + 1),
              ),
            ],
          ),

          // Obs inline (só aparece quando qty > 0)
          if (qty > 0)
            GestureDetector(
              onTap: () => _openNotesSheet(context),
              child: Container(
                margin: const EdgeInsets.only(top: 8),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: notes != null && notes.isNotEmpty
                      ? const Color(0xFFFBEEF0)
                      : GuColors.cream50,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                    color: notes != null && notes.isNotEmpty
                        ? GuColors.bordeaux300
                        : GuColors.cream200,
                    style: notes != null && notes.isNotEmpty
                        ? BorderStyle.solid
                        : BorderStyle.solid,
                  ),
                ),
                child: Text(
                  notes != null && notes.isNotEmpty
                      ? notes
                      : 'Adicionar observação…',
                  style: GuType.caption.copyWith(
                    fontSize: 10,
                    color: notes != null && notes.isNotEmpty
                        ? GuColors.bordeaux700
                        : GuColors.ink500,
                    letterSpacing: 0.5,
                    fontStyle: FontStyle.normal,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

// ─── Stepper pill ─────────────────────────────────────────────────────────────

class _PillStepper extends StatelessWidget {
  final int value;
  final VoidCallback onDecrement;
  final VoidCallback onIncrement;
  const _PillStepper({required this.value, required this.onDecrement, required this.onIncrement});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(3),
      decoration: BoxDecoration(
        color: GuColors.cream100,
        borderRadius: BorderRadius.circular(99),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _PillBtn(icon: Icons.remove, onTap: value > 0 ? onDecrement : null),
          SizedBox(
            width: 22,
            child: Text(
              '$value',
              style: GuType.bodySm.copyWith(
                fontSize: 12.5,
                fontWeight: FontWeight.w500,
                color: value > 0 ? GuColors.ink900 : GuColors.ink300,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          _PillBtn(icon: Icons.add, onTap: onIncrement),
        ],
      ),
    );
  }
}

class _PillBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onTap;
  const _PillBtn({required this.icon, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 22,
        height: 22,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          border: Border.all(color: GuColors.cream200),
        ),
        child: Icon(
          icon,
          size: 13,
          color: onTap != null ? GuColors.ink900 : GuColors.ink300,
        ),
      ),
    );
  }
}

// ─── Confirm bar flutuante ────────────────────────────────────────────────────

class _ConfirmBar extends StatelessWidget {
  final int count;
  final VoidCallback onTap;
  const _ConfirmBar({required this.count, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        decoration: BoxDecoration(
          color: GuColors.bordeaux700,
          borderRadius: BorderRadius.circular(12),
          boxShadow: const [
            BoxShadow(
              color: Color(0x662E1116),
              blurRadius: 24,
              offset: Offset(0, 10),
              spreadRadius: -10,
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '$count ${count == 1 ? "ITEM SELECIONADO" : "ITENS SELECIONADOS"}',
                    style: GuType.caption.copyWith(
                      color: GuColors.bordeaux300,
                      letterSpacing: 1.5,
                      fontSize: 9,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Confirmar pedido',
                    style: GuType.body.copyWith(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward, color: Colors.white, size: 18),
          ],
        ),
      ),
    );
  }
}

// ─── Notes bottom sheet ───────────────────────────────────────────────────────

class _NotesSheet extends StatefulWidget {
  final ProductModel product;
  const _NotesSheet({required this.product});

  @override
  State<_NotesSheet> createState() => _NotesSheetState();
}

class _NotesSheetState extends State<_NotesSheet> {
  late final TextEditingController _ctrl;

  @override
  void initState() {
    super.initState();
    final existing = context.read<MenuProvider>().notesOf(widget.product.id);
    _ctrl = TextEditingController(text: existing ?? '');
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(
        22, 8, 22,
        22 + MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
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
          Text(widget.product.name, style: GuType.h3),
          const SizedBox(height: 4),
          Text(
            'Observação para este item',
            style: GuType.bodySm.copyWith(color: GuColors.ink500),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _ctrl,
            autofocus: true,
            maxLines: 3,
            style: GuType.body.copyWith(color: GuColors.ink900),
            decoration: InputDecoration(
              hintText: 'Ex: sem gelo, bem gelado…',
              hintStyle: GuType.body.copyWith(color: GuColors.ink300),
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              context.read<MenuProvider>().setNotes(widget.product.id, _ctrl.text);
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: GuColors.bordeaux700,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              elevation: 0,
            ),
            child: Text('Salvar', style: GuType.h3.copyWith(color: Colors.white, fontSize: 14)),
          ),
        ],
      ),
    );
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────

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
