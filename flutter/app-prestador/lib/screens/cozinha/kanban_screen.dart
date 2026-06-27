import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../models/order_item_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/items_provider.dart';
import '../../services/socket_service.dart';
import '../../tokens/gu_colors.dart';
import '../../tokens/gu_type.dart';
import '../../config.dart';

class KanbanScreen extends StatefulWidget {
  const KanbanScreen({super.key});

  @override
  State<KanbanScreen> createState() => _KanbanScreenState();
}

class _KanbanScreenState extends State<KanbanScreen> {
  Timer? _clockTimer;
  String _clock = '';

  @override
  void initState() {
    super.initState();
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.landscapeLeft,
      DeviceOrientation.landscapeRight,
    ]);
    _updateClock();
    _clockTimer = Timer.periodic(const Duration(seconds: 1), (_) => _updateClock());

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      final items = context.read<ItemsProvider>();
      final socket = SocketService();
      socket.connect(AppConfig.gatewayUrl, auth.user!.token);
      items.load();
      items.startListening();
    });
  }

  void _updateClock() {
    final now = DateTime.now();
    setState(() {
      _clock =
          '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')}';
    });
  }

  @override
  void dispose() {
    _clockTimer?.cancel();
    SystemChrome.setPreferredOrientations(DeviceOrientation.values);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final items = context.watch<ItemsProvider>();
    final user = auth.user!;
    final initials = user.name.split(' ').take(2).map((w) => w[0].toUpperCase()).join();

    return Scaffold(
      backgroundColor: GuColors.bordeaux900,
      body: Column(
        children: [
          _TopBar(initials: initials, clock: _clock),
          _StatBar(items: items),
          Expanded(
            child: _Board(items: items),
          ),
        ],
      ),
    );
  }
}

// ── Top bar ──────────────────────────────────────────────────────────────────

class _TopBar extends StatelessWidget {
  final String initials;
  final String clock;

  const _TopBar({required this.initials, required this.clock});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: GuColors.bordeaux900,
      padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
      child: Row(
        children: [
          _ArchMini(),
          const SizedBox(width: 10),
          Text('GreetUp',
              style: GuType.h2.copyWith(
                  color: GuColors.cream50, fontSize: 17, letterSpacing: -0.01)),
          Container(
              width: 1,
              height: 24,
              color: GuColors.bordeaux700,
              margin: const EdgeInsets.symmetric(horizontal: 12)),
          Text('COZINHA',
              style: GuType.caption.copyWith(
                  color: GuColors.champagne, letterSpacing: 0.18)),
          const Spacer(),
          Text('Evento ao vivo',
              style: GuType.caption.copyWith(
                  color: GuColors.bordeaux300, letterSpacing: 0.14)),
          const SizedBox(width: 18),
          Text(clock,
              style: GuType.caption.copyWith(
                  color: GuColors.cream50,
                  fontSize: 14,
                  letterSpacing: 0.04,
                  fontWeight: FontWeight.w500)),
          const SizedBox(width: 18),
          CircleAvatar(
            radius: 16,
            backgroundColor: GuColors.bordeaux700,
            child: Text(initials,
                style: GuType.body.copyWith(
                    color: GuColors.cream50, fontSize: 12, fontWeight: FontWeight.w500)),
          ),
        ],
      ),
    );
  }
}

class _ArchMini extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return CustomPaint(size: const Size(26, 26), painter: _ArchMiniPainter());
  }
}

class _ArchMiniPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final stroke = Paint()
      ..color = GuColors.cream50
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.8
      ..strokeCap = StrokeCap.round;
    final fill = Paint()
      ..color = GuColors.champagne
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(size.width * 0.125, size.height)
      ..lineTo(size.width * 0.125, size.height * 0.458)
      ..arcToPoint(
        Offset(size.width * 0.875, size.height * 0.458),
        radius: Radius.circular(size.width * 0.375),
        clockwise: false,
      )
      ..lineTo(size.width * 0.875, size.height);
    canvas.drawPath(path, stroke);
    canvas.drawCircle(
        Offset(size.width * 0.5, size.height * 0.542), size.width * 0.092, fill);
  }

  @override
  bool shouldRepaint(_) => false;
}

// ── Stat bar ─────────────────────────────────────────────────────────────────

class _StatBar extends StatelessWidget {
  final ItemsProvider items;
  const _StatBar({required this.items});

  @override
  Widget build(BuildContext context) {
    final atrasados = items.emPreparo
        .where((i) => DateTime.now().difference(i.createdAt).inMinutes > 8)
        .length;

    return Container(
      color: GuColors.bordeaux800,
      padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 12),
      child: Row(
        children: [
          _Stat(label: 'Na fila', value: '${items.pendentes.length}'),
          _Divider(),
          _Stat(label: 'Em preparo', value: '${items.emPreparo.length}'),
          _Divider(),
          _Stat(
              label: 'Prontos',
              value: '${items.prontos.length}',
              valueColor: const Color(0xFF86EFAC)),
          _Divider(),
          _Stat(
              label: 'Atrasados',
              value: '$atrasados',
              valueColor: atrasados > 0 ? const Color(0xFFFCA5A5) : GuColors.cream50),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;
  const _Stat({required this.label, required this.value, this.valueColor});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: GuType.caption.copyWith(
                color: GuColors.bordeaux300, fontSize: 10, letterSpacing: 0.14)),
        const SizedBox(height: 2),
        Text(value,
            style: GuType.h1.copyWith(
                color: valueColor ?? GuColors.cream50,
                fontSize: 22,
                letterSpacing: -0.02,
                fontFeatures: [const FontFeature.tabularFigures()])),
      ],
    );
  }
}

class _Divider extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
        width: 1, height: 36, color: GuColors.bordeaux700,
        margin: const EdgeInsets.symmetric(horizontal: 24));
  }
}

// ── Board ─────────────────────────────────────────────────────────────────────

class _Board extends StatelessWidget {
  final ItemsProvider items;
  const _Board({required this.items});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _Column(
              label: 'PENDENTE',
              dot: GuColors.champagne,
              items: items.pendentes,
              status: 'PENDENTE'),
          const SizedBox(width: 12),
          _Column(
              label: 'EM PREPARO',
              dot: const Color(0xFF6366F1),
              items: items.emPreparo,
              status: 'EM_PREPARO'),
          const SizedBox(width: 12),
          _Column(
              label: 'PRONTO',
              dot: const Color(0xFF22C55E),
              items: items.prontos,
              status: 'PRONTO'),
          const SizedBox(width: 12),
          _Column(
              label: 'ENTREGUE',
              dot: GuColors.ink500,
              items: items.entregues.take(8).toList(),
              status: 'ENTREGUE',
              dimmed: true),
        ],
      ),
    );
  }
}

class _Column extends StatelessWidget {
  final String label;
  final Color dot;
  final List<OrderItemModel> items;
  final String status;
  final bool dimmed;

  const _Column({
    required this.label,
    required this.dot,
    required this.items,
    required this.status,
    this.dimmed = false,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          // Coluna header
          Padding(
            padding: const EdgeInsets.only(left: 4, right: 4, bottom: 8),
            child: Row(
              children: [
                Container(
                    width: 7, height: 7,
                    decoration: BoxDecoration(color: dot, shape: BoxShape.circle)),
                const SizedBox(width: 8),
                Text(label,
                    style: GuType.caption.copyWith(
                        color: GuColors.cream100,
                        letterSpacing: 0.2,
                        fontSize: 11)),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 2),
                  decoration: BoxDecoration(
                      color: GuColors.bordeaux800,
                      borderRadius: BorderRadius.circular(99)),
                  child: Text('${items.length}',
                      style: GuType.caption.copyWith(
                          color: GuColors.cream100,
                          fontSize: 11,
                          letterSpacing: 0.1)),
                ),
              ],
            ),
          ),
          Container(height: 1, color: GuColors.bordeaux800),
          const SizedBox(height: 8),
          Expanded(
            child: ListView.separated(
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (_, i) => _KanbanCard(item: items[i], dimmed: dimmed),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Kanban card ───────────────────────────────────────────────────────────────

class _KanbanCard extends StatelessWidget {
  final OrderItemModel item;
  final bool dimmed;

  const _KanbanCard({required this.item, this.dimmed = false});

  Color get _borderColor {
    switch (item.status) {
      case 'PENDENTE':    return GuColors.champagne;
      case 'EM_PREPARO':  return const Color(0xFF6366F1);
      case 'PRONTO':      return const Color(0xFF22C55E);
      default:            return GuColors.ink300;
    }
  }

  String get _elapsed {
    final diff = DateTime.now().difference(item.createdAt);
    if (diff.inSeconds < 60) return '${diff.inSeconds}s';
    if (diff.inHours < 1) return '${diff.inMinutes}:${(diff.inSeconds % 60).toString().padLeft(2, '0')}';
    return '${diff.inHours}h ${diff.inMinutes % 60}min';
  }

  bool get _isLate => DateTime.now().difference(item.createdAt).inMinutes > 8;

  @override
  Widget build(BuildContext context) {
    final items = context.read<ItemsProvider>();

    return Opacity(
      opacity: dimmed ? 0.55 : 1.0,
      child: Container(
        decoration: BoxDecoration(
          color: GuColors.cream50,
          borderRadius: BorderRadius.circular(10),
          border: Border(left: BorderSide(color: _borderColor, width: 4)),
        ),
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header: mesa + nº pedido
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                RichText(
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: item.tableCode.padLeft(2, '0'),
                        style: GuType.h1.copyWith(
                            color: GuColors.ink900,
                            fontSize: 24,
                            fontWeight: FontWeight.w700,
                            letterSpacing: -0.025),
                      ),
                      TextSpan(
                        text: ' MESA',
                        style: GuType.caption.copyWith(
                            color: GuColors.ink500,
                            fontSize: 10,
                            letterSpacing: 0),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                Text(
                  '№ ${item.orderId.substring(item.orderId.length > 4 ? item.orderId.length - 4 : 0)}',
                  style: GuType.caption.copyWith(
                      color: GuColors.ink500, fontSize: 10, letterSpacing: 0.14),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Produto
            Row(
              children: [
                Text(
                  '${item.quantity}× ',
                  style: GuType.body.copyWith(
                      color: GuColors.bordeaux700,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      fontFamily: 'JetBrainsMono'),
                ),
                Expanded(
                  child: Text(
                    item.productName,
                    style: GuType.body.copyWith(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        letterSpacing: -0.008),
                  ),
                ),
              ],
            ),

            // Observações
            if (item.observations != null && item.observations!.isNotEmpty) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.fromLTRB(12, 8, 10, 8),
                decoration: const BoxDecoration(
                  color: Color(0xFFFEF3C7),
                  border: Border(left: BorderSide(color: Color(0xFFD97706), width: 4)),
                  borderRadius: BorderRadius.only(
                    topRight: Radius.circular(6),
                    bottomRight: Radius.circular(6),
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                          color: const Color(0xFFD97706),
                          borderRadius: BorderRadius.circular(3)),
                      child: Text('OBS',
                          style: GuType.caption.copyWith(
                              color: Colors.white, fontSize: 9, letterSpacing: 0.14)),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        item.observations!,
                        style: GuType.body.copyWith(
                            color: const Color(0xFF7C2D12),
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            letterSpacing: -0.005),
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 8),
            // Footer: timer + ação
            Row(
              children: [
                Icon(Icons.schedule,
                    size: 11,
                    color: _isLate ? const Color(0xFFB91C1C) : GuColors.ink700),
                const SizedBox(width: 4),
                Text(
                  _isLate ? '$_elapsed · atrasado' : _elapsed,
                  style: GuType.caption.copyWith(
                      color: _isLate ? const Color(0xFFB91C1C) : GuColors.ink700,
                      fontSize: 11,
                      fontWeight: _isLate ? FontWeight.w500 : FontWeight.normal,
                      letterSpacing: 0.06),
                ),
                const Spacer(),
                if (item.status == 'PENDENTE')
                  _ActionButton(
                    label: 'Iniciar preparo',
                    primary: false,
                    onTap: () => items.advanceStatus(item),
                  ),
                if (item.status == 'EM_PREPARO')
                  _ActionButton(
                    label: 'Marcar pronto',
                    primary: true,
                    onTap: () => items.advanceStatus(item),
                  ),
                if (item.status == 'PRONTO')
                  Text('Aguard. garçom',
                      style: GuType.caption.copyWith(
                          color: const Color(0xFF15803D),
                          fontSize: 12,
                          letterSpacing: 0)),
              ],
            ),

            // Cliente
            if (item.customerName != null) ...[
              const SizedBox(height: 4),
              Text(
                item.customerName!,
                style: GuType.caption.copyWith(
                    color: GuColors.ink500, fontSize: 10, letterSpacing: 0.1),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final String label;
  final bool primary;
  final VoidCallback onTap;

  const _ActionButton({
    required this.label,
    required this.primary,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: primary ? GuColors.bordeaux700 : Colors.white,
          border: Border.all(color: GuColors.bordeaux700, width: 1.5),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(
          label,
          style: GuType.body.copyWith(
            color: primary ? Colors.white : GuColors.bordeaux700,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}
