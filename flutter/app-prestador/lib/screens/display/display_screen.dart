import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:wakelock_plus/wakelock_plus.dart';
import '../../models/order_item_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/items_provider.dart';
import '../../services/socket_service.dart';
import '../../tokens/gu_colors.dart';
import '../../tokens/gu_type.dart';
import '../../config.dart';

class DisplayScreen extends StatefulWidget {
  const DisplayScreen({super.key});

  @override
  State<DisplayScreen> createState() => _DisplayScreenState();
}

class _DisplayScreenState extends State<DisplayScreen> {
  Timer? _clockTimer;
  String _clock = '';

  @override
  void initState() {
    super.initState();
    WakelockPlus.enable();
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.landscapeLeft,
      DeviceOrientation.landscapeRight,
    ]);
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersive);

    _updateClock();
    _clockTimer = Timer.periodic(const Duration(seconds: 1), (_) => _updateClock());

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      final items = context.read<ItemsProvider>();
      final socket = SocketService();
      socket.connect(AppConfig.gatewayUrl, auth.user!.token);
      items.load();
      items.startListening(pollIntervalSeconds: 60);
    });
  }

  void _updateClock() {
    final now = DateTime.now();
    setState(() {
      _clock =
          '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';
    });
  }

  @override
  void dispose() {
    _clockTimer?.cancel();
    WakelockPlus.disable();
    SystemChrome.setPreferredOrientations(DeviceOrientation.values);
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final items = context.watch<ItemsProvider>();
    final prontos = items.prontos;
    final entregues = items.entregues.reversed.take(10).toList();

    return Scaffold(
      backgroundColor: GuColors.bordeaux900,
      body: Column(
        children: [
          _TopBar(clock: _clock),
          Expanded(
            child: Row(
              children: [
                Expanded(child: _DisplayColumn(
                  label: 'PRONTO PARA ENTREGA',
                  dot: const Color(0xFF22C55E),
                  items: prontos,
                  emptyMsg: 'Nenhum item pronto',
                )),
                Container(width: 3, color: GuColors.bordeaux800),
                Expanded(child: _DisplayColumn(
                  label: 'ENTREGUES · RECENTES',
                  dot: GuColors.ink500,
                  items: entregues,
                  dimmed: true,
                  emptyMsg: 'Nenhum item entregue ainda',
                )),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Top bar ───────────────────────────────────────────────────────────────────

class _TopBar extends StatelessWidget {
  final String clock;
  const _TopBar({required this.clock});

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
          Text('DISPLAY · EVENTO',
              style: GuType.caption.copyWith(
                  color: GuColors.champagne, letterSpacing: 0.18)),
          const Spacer(),
          Text(clock,
              style: GuType.h1.copyWith(
                  color: GuColors.cream50,
                  fontSize: 20,
                  letterSpacing: -0.02,
                  fontFeatures: [const FontFeature.tabularFigures()])),
        ],
      ),
    );
  }
}

class _ArchMini extends StatelessWidget {
  @override
  Widget build(BuildContext context) =>
      CustomPaint(size: const Size(26, 26), painter: _ArchMiniPainter());
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

// ── Coluna do display ─────────────────────────────────────────────────────────

class _DisplayColumn extends StatelessWidget {
  final String label;
  final Color dot;
  final List<OrderItemModel> items;
  final String emptyMsg;
  final bool dimmed;

  const _DisplayColumn({
    required this.label,
    required this.dot,
    required this.items,
    required this.emptyMsg,
    this.dimmed = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          color: GuColors.bordeaux800,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          child: Row(
            children: [
              Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(color: dot, shape: BoxShape.circle)),
              const SizedBox(width: 10),
              Text(label,
                  style: GuType.caption.copyWith(
                      color: GuColors.cream100,
                      letterSpacing: 0.2,
                      fontSize: 12)),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(
                    color: GuColors.bordeaux900,
                    borderRadius: BorderRadius.circular(99)),
                child: Text('${items.length}',
                    style: GuType.caption.copyWith(
                        color: GuColors.cream100, fontSize: 12)),
              ),
            ],
          ),
        ),
        Expanded(
          child: items.isEmpty
              ? Center(
                  child: Text(emptyMsg,
                      style: GuType.body.copyWith(
                          color: GuColors.bordeaux500, fontSize: 15)))
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: items.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (_, i) =>
                      _DisplayCard(item: items[i], dimmed: dimmed),
                ),
        ),
      ],
    );
  }
}

// ── Card do display (tipografia 1.5×) ────────────────────────────────────────

class _DisplayCard extends StatelessWidget {
  final OrderItemModel item;
  final bool dimmed;
  const _DisplayCard({required this.item, this.dimmed = false});

  Color get _borderColor => dimmed ? GuColors.ink500 : const Color(0xFF22C55E);

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: dimmed ? 0.55 : 1.0,
      child: Container(
        decoration: BoxDecoration(
          color: GuColors.cream50,
          borderRadius: BorderRadius.circular(10),
          border: Border(left: BorderSide(color: _borderColor, width: 5)),
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  item.tableCode.padLeft(2, '0'),
                  style: GuType.h1.copyWith(
                      color: GuColors.ink900,
                      fontSize: 33,
                      fontWeight: FontWeight.w700,
                      letterSpacing: -0.03),
                ),
                const SizedBox(width: 6),
                Text('MESA',
                    style: GuType.caption.copyWith(
                        color: GuColors.ink500,
                        fontSize: 13,
                        letterSpacing: 0.1)),
                const Spacer(),
                Text(
                  '№ ${item.orderId.substring(item.orderId.length > 4 ? item.orderId.length - 4 : 0)}',
                  style: GuType.caption.copyWith(
                      color: GuColors.ink500, fontSize: 13, letterSpacing: 0.12),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Text('${item.quantity}× ',
                    style: GuType.caption.copyWith(
                        color: GuColors.bordeaux700,
                        fontSize: 16,
                        fontFamily: 'JetBrainsMono',
                        letterSpacing: 0.04)),
                Expanded(
                  child: Text(item.productName,
                      style: GuType.body.copyWith(
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                          letterSpacing: -0.01)),
                ),
              ],
            ),
            if (item.customerName != null) ...[
              const SizedBox(height: 6),
              Text(item.customerName!,
                  style: GuType.caption.copyWith(
                      color: GuColors.ink500, fontSize: 13, letterSpacing: 0.1)),
            ],
          ],
        ),
      ),
    );
  }
}
