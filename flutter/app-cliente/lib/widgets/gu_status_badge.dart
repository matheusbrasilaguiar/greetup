import 'package:flutter/material.dart';
import '../tokens/gu_colors.dart';
import '../tokens/gu_type.dart';

class GuStatusBadge extends StatelessWidget {
  final GuStatusColor color;
  final String label;

  const GuStatusBadge({super.key, required this.color, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: GuSpacing.s1),
      decoration: BoxDecoration(
        color: color.bg,
        borderRadius: BorderRadius.circular(GuRadius.pill),
        border: Border.all(color: color.br),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(color: color.br, shape: BoxShape.circle),
          ),
          const SizedBox(width: GuSpacing.s2),
          Text(
            label.toUpperCase(),
            style: GuType.caption.copyWith(color: color.tx, letterSpacing: 1.3),
          ),
        ],
      ),
    );
  }
}

class ItemStatusBadge extends StatelessWidget {
  final String status;
  const ItemStatusBadge({super.key, required this.status});

  static String _label(String status) {
    switch (status) {
      case 'PENDENTE':   return 'Pendente';
      case 'EM_PREPARO': return 'Em preparo';
      case 'PRONTO':     return 'Pronto';
      case 'ENTREGUE':   return 'Entregue';
      default:           return status;
    }
  }

  @override
  Widget build(BuildContext context) => GuStatusBadge(
    color: GuStatus.fromItemStatus(status),
    label: _label(status),
  );
}
