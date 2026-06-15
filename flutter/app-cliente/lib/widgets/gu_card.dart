import 'package:flutter/material.dart';
import '../tokens/gu_colors.dart';

/// Card base do design system. Use [statusBorderColor] para a variante
/// com borda esquerda de 4px (status de pedido/mesa).
class GuCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final Color? statusBorderColor;
  final double opacity;
  final VoidCallback? onTap;

  const GuCard({
    super.key,
    required this.child,
    this.padding,
    this.statusBorderColor,
    this.opacity = 1.0,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final hasStatus = statusBorderColor != null;

    final decoration = BoxDecoration(
      color: GuColors.cream100,
      borderRadius: BorderRadius.circular(GuRadius.xl),
      border: hasStatus
          ? Border(
              left:   BorderSide(color: statusBorderColor!, width: 4),
              top:    const BorderSide(color: GuColors.cream200),
              right:  const BorderSide(color: GuColors.cream200),
              bottom: const BorderSide(color: GuColors.cream200),
            )
          : Border.all(color: GuColors.cream200),
      boxShadow: const [GuShadows.card],
    );

    Widget card = Container(
      padding: padding ?? const EdgeInsets.all(GuSpacing.s7 - 4), // 20px
      decoration: decoration,
      child: child,
    );

    if (onTap != null) {
      card = Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(GuRadius.xl),
        child: InkWell(
          borderRadius: BorderRadius.circular(GuRadius.xl),
          onTap: onTap,
          child: card,
        ),
      );
    }

    if (opacity < 1.0) {
      card = Opacity(opacity: opacity, child: card);
    }

    return card;
  }
}
