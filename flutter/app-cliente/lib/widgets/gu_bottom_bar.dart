import 'package:flutter/material.dart';
import '../tokens/gu_colors.dart';
import '../tokens/gu_type.dart';

/// Bottom nav do app: MESAS · PERFIL.
/// "Pedido" foi removido — o contexto de pedido existe só dentro de uma mesa ativa.
/// [activeIndex]: 0 = Mesas, 1 = Perfil
/// [onMesas]: callback ao tocar em Mesas
class GuAppBottomNav extends StatelessWidget {
  final int activeIndex;
  final VoidCallback? onMesas;

  const GuAppBottomNav({super.key, required this.activeIndex, this.onMesas});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: GuColors.cream200)),
      ),
      padding: const EdgeInsets.fromLTRB(8, 10, 8, 18),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _NavItem(
            icon: Icons.grid_view_outlined,
            label: 'MESAS',
            active: activeIndex == 0,
            onTap: onMesas ?? () {},
          ),
          _NavItem(
            icon: Icons.person_outline,
            label: 'PERFIL',
            active: activeIndex == 1,
            onTap: () {},
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool active;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.active,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = active ? GuColors.bordeaux700 : GuColors.ink500;
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: 72,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 22, color: color),
            const SizedBox(height: 4),
            Text(
              label,
              style: GuType.caption.copyWith(
                fontSize: 9,
                color: color,
                letterSpacing: 1.0,
              ),
            ),
            if (active) ...[
              const SizedBox(height: 3),
              Container(
                width: 4, height: 4,
                decoration: const BoxDecoration(
                  color: GuColors.bordeaux700,
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
