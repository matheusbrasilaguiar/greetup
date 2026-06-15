import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../models/table_model.dart';
import '../providers/auth_provider.dart';
import '../providers/tables_provider.dart';
import '../tokens/gu_colors.dart';
import '../tokens/gu_type.dart';
import '../widgets/gu_bottom_bar.dart';

class TablesScreen extends StatefulWidget {
  const TablesScreen({super.key});

  @override
  State<TablesScreen> createState() => _TablesScreenState();
}

class _TablesScreenState extends State<TablesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final tables = context.read<TablesProvider>();
      tables.loadTables();
      tables.listenToSessionEvents();
    });
  }

  @override
  void dispose() {
    context.read<TablesProvider>().stopListening();
    super.dispose();
  }

  void _onTableTap(TableModel table) {
    final auth = context.read<AuthProvider>();
    if (table.isOccupied) {
      final mySession = table.activeSession?.attendantId == auth.user?.id;
      if (mySession) {
        context.push('/tables/${table.id}/account?sessionId=${table.activeSession!.id}');
      }
    } else if (table.isOpen) {
      context.push('/tables/${table.id}/open-session');
    }
  }

  String _greeting() {
    final h = DateTime.now().hour;
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  @override
  Widget build(BuildContext context) {
    final auth      = context.watch<AuthProvider>();
    final tables    = context.watch<TablesProvider>();
    final firstName = (auth.user?.name ?? '').split(' ').first;
    final total     = tables.tables.length;
    final free      = tables.tables.where((t) => t.isOpen).length;

    return Scaffold(
      backgroundColor: GuColors.cream50,
      body: SafeArea(
        // Centraliza e limita largura em telas wide (tablet / landscape)
        child: Align(
          alignment: Alignment.topCenter,
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 560),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // ── Greet header ────────────────────────────────────
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'GREETUP · GESTÃO DE MESAS',
                              style: GuType.caption.copyWith(
                                color: GuColors.bordeaux700,
                                letterSpacing: 1.4,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              '${_greeting()},\n$firstName.',
                              style: GuType.h1,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      // Sino — tap=refresh, long-press=logout
                      GestureDetector(
                        onTap: tables.loadTables,
                        onLongPress: () => context.read<AuthProvider>().logout(),
                        child: Container(
                          width: 36, height: 36,
                          decoration: const BoxDecoration(
                            color: GuColors.cream100,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.notifications_none_outlined,
                            size: 18,
                            color: GuColors.ink700,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // ── Divisor + sub-cabeçalho ──────────────────────────
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'MESAS DO ESTANDE',
                        style: GuType.caption.copyWith(
                          color: GuColors.ink500,
                          letterSpacing: 1.3,
                          fontSize: 9.5,
                        ),
                      ),
                      if (total > 0)
                        Text(
                          '$free / $total LIVRES',
                          style: GuType.caption.copyWith(
                            color: GuColors.bordeaux700,
                            letterSpacing: 1.3,
                            fontSize: 9.5,
                          ),
                        ),
                    ],
                  ),
                ),

                const SizedBox(height: 10),

                // ── Grid ────────────────────────────────────────────
                Expanded(
                  child: tables.loading && tables.tables.isEmpty
                      ? const Center(child: CircularProgressIndicator(color: GuColors.bordeaux700))
                      : tables.error != null
                          ? Center(child: Text(tables.error!, style: GuType.body))
                          : tables.tables.isEmpty
                              ? Center(child: Text('Nenhuma mesa cadastrada.', style: GuType.body))
                              : _TableGrid(
                                  tables: tables.tables,
                                  myId: auth.user?.id ?? '',
                                  onTap: _onTableTap,
                                ),
                ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: const GuAppBottomNav(activeIndex: 0),
    );
  }
}

// ─── Grid ────────────────────────────────────────────────────────────────────

class _TableGrid extends StatelessWidget {
  final List<TableModel> tables;
  final String myId;
  final ValueChanged<TableModel> onTap;

  const _TableGrid({required this.tables, required this.myId, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.fromLTRB(20, 4, 20, 20),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.25,
      ),
      itemCount: tables.length,
      itemBuilder: (_, i) {
        final table     = tables[i];
        final isMyTable = table.activeSession?.attendantId == myId;
        return _TableCard(
          table: table,
          isMyTable: isMyTable,
          onTap: () => onTap(table),
        );
      },
    );
  }
}

// ─── Card ─────────────────────────────────────────────────────────────────────
//
// Três estados, fiéis ao protótipo:
//   FREE  → bg verde #F0FDF4, borda suave #bfe8c9, número 24px verde
//   BUSY  → bg bordô-soft #FBEEF0, borda bordeaux/300
//   MINE  → bg branco, borda 2px bordeaux/700 + glow, pip "Minha"
//   CLOSED → opacidade 0.5

class _TableCard extends StatelessWidget {
  final TableModel table;
  final bool isMyTable;
  final VoidCallback onTap;

  const _TableCard({required this.table, required this.isMyTable, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final occupied = table.isOccupied;
    final closed   = table.isClosed;
    final session  = table.activeSession;

    // ── Aparência por estado ──────────────────────────────────────────
    final Color bg;
    final BoxBorder border;
    final List<BoxShadow> shadows;

    if (closed) {
      bg = GuColors.cream100;
      border = Border.all(color: GuColors.cream200, width: 1.5);
      shadows = const [];
    } else if (isMyTable && occupied) {
      bg = Colors.white;
      border = Border.all(color: GuColors.bordeaux700, width: 2);
      shadows = [
        const BoxShadow(
          color: Color(0x146B2331), // rgba(107,35,49,.08)
          blurRadius: 0,
          spreadRadius: 4,
        ),
      ];
    } else if (occupied) {
      bg = const Color(0xFFFBEEF0);
      border = Border.all(color: GuColors.bordeaux300, width: 1.5);
      shadows = const [];
    } else {
      // FREE
      bg = const Color(0xFFF0FDF4);
      border = Border.all(color: const Color(0xFFBFE8C9), width: 1.5);
      shadows = const [];
    }

    Widget card = GestureDetector(
      onTap: closed ? null : onTap,
      child: Container(
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(12),
          border: border,
          boxShadow: shadows,
        ),
        padding: const EdgeInsets.fromLTRB(12, 14, 12, 12),
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // ── Topo ──────────────────────────────────────────
                _CardTop(table: table, isMyTable: isMyTable, occupied: occupied, closed: closed),

                // ── Rodapé ────────────────────────────────────────
                if (!closed)
                  _CardBottom(table: table, isMyTable: isMyTable, occupied: occupied, session: session),
              ],
            ),

            // Pip "Minha" (canto superior direito)
            if (isMyTable && occupied)
              Positioned(
                top: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: GuColors.cream100,
                    borderRadius: BorderRadius.circular(99),
                  ),
                  child: Text(
                    'Minha',
                    style: GuType.caption.copyWith(
                      fontSize: 8.5,
                      color: GuColors.bordeaux700,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );

    return closed ? Opacity(opacity: 0.5, child: card) : card;
  }
}

class _CardTop extends StatelessWidget {
  final TableModel table;
  final bool isMyTable;
  final bool occupied;
  final bool closed;

  const _CardTop({
    required this.table,
    required this.isMyTable,
    required this.occupied,
    required this.closed,
  });

  @override
  Widget build(BuildContext context) {
    if (!occupied && !closed) {
      // FREE — número grande verde
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            table.code,
            style: GuType.h2.copyWith(
              fontSize: 24,
              fontWeight: FontWeight.w600,
              letterSpacing: -0.48,
              color: const Color(0xFF15803D),
            ),
          ),
          const SizedBox(height: 2),
          Text(
            'LIVRE',
            style: GuType.caption.copyWith(
              fontSize: 9,
              color: GuColors.ink500,
              letterSpacing: 1.3,
            ),
          ),
        ],
      );
    }

    if (closed) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            table.code,
            style: GuType.h3.copyWith(color: GuColors.ink500),
          ),
          const SizedBox(height: 2),
          Text(
            'FORA DE SERVIÇO',
            style: GuType.caption.copyWith(fontSize: 9, letterSpacing: 1.3),
          ),
        ],
      );
    }

    // BUSY / MINE — nome menor + visitante
    final session = table.activeSession;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          table.code,
          style: GuType.body.copyWith(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            letterSpacing: -0.07,
            color: GuColors.bordeaux700,
          ),
        ),
        if (session?.customerName != null) ...[
          const SizedBox(height: 4),
          Text(
            session!.customerName!,
            style: GuType.bodySm.copyWith(
              fontWeight: FontWeight.w500,
              letterSpacing: -0.08,
              color: GuColors.ink900,
              height: 1.2,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ],
    );
  }
}

class _CardBottom extends StatelessWidget {
  final TableModel table;
  final bool isMyTable;
  final bool occupied;
  final dynamic session;

  const _CardBottom({
    required this.table,
    required this.isMyTable,
    required this.occupied,
    required this.session,
  });

  @override
  Widget build(BuildContext context) {
    if (!occupied) {
      // FREE — ícone de mesa no canto inferior direito
      return Align(
        alignment: Alignment.bottomRight,
        child: Icon(
          Icons.table_bar_outlined,
          size: 18,
          color: const Color(0xFF15803D).withValues(alpha: 0.5),
        ),
      );
    }

    // BUSY / MINE — meta: tempo + atendente
    final dur = session?.durationMinutes ?? 0;
    final attendant = session?.attendantName ?? '';
    final label = [
      if (dur > 0) '$dur min',
      if (attendant.isNotEmpty) attendant.split(' ').first,
    ].join(' · ');

    return Text(
      label.toUpperCase(),
      style: GuType.caption.copyWith(
        fontSize: 9,
        color: GuColors.bordeaux700,
        letterSpacing: 1.2,
      ),
    );
  }
}
