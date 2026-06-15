import 'package:flutter/material.dart';
import '../tokens/gu_colors.dart';
import '../tokens/gu_type.dart';

enum GuButtonIntent { primary, secondary, ghost, danger, outlineDanger }

class GuButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final GuButtonIntent intent;
  final bool small;
  final IconData? icon;
  final bool loading;

  const GuButton(
    this.label, {
    super.key,
    this.onPressed,
    this.intent = GuButtonIntent.primary,
    this.small = false,
    this.icon,
    this.loading = false,
  });

  @override
  Widget build(BuildContext context) {
    final disabled = onPressed == null || loading;
    final pad = small
        ? const EdgeInsets.symmetric(horizontal: GuSpacing.s5, vertical: GuSpacing.s3)
        : const EdgeInsets.symmetric(horizontal: GuSpacing.s7, vertical: GuSpacing.s4);
    final radius = BorderRadius.circular(small ? GuRadius.sm : GuRadius.md);

    late Color bg, fg;
    Border? border;

    switch (intent) {
      case GuButtonIntent.primary:
        bg = disabled ? GuColors.cream200 : GuColors.bordeaux700;
        fg = disabled ? GuColors.ink300 : Colors.white;
      case GuButtonIntent.secondary:
        bg = Colors.transparent;
        fg = GuColors.bordeaux700;
        border = Border.all(color: GuColors.bordeaux700, width: 1.5);
      case GuButtonIntent.ghost:
        bg = Colors.transparent;
        fg = GuColors.ink700;
      case GuButtonIntent.danger:
        bg = GuColors.danger;
        fg = Colors.white;
      case GuButtonIntent.outlineDanger:
        bg = Colors.white;
        fg = GuColors.danger;
        border = Border.all(color: GuColors.danger, width: 1.5);
    }

    return Material(
      color: bg,
      borderRadius: radius,
      child: InkWell(
        borderRadius: radius,
        onTap: disabled ? null : onPressed,
        child: Container(
          padding: pad,
          decoration: BoxDecoration(borderRadius: radius, border: border),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (loading)
                SizedBox(
                  width: 14,
                  height: 14,
                  child: CircularProgressIndicator(strokeWidth: 2, color: fg),
                )
              else ...[
                if (icon != null) ...[
                  Icon(icon, size: GuSpacing.s5, color: fg),
                  const SizedBox(width: GuSpacing.s3),
                ],
                Text(
                  label,
                  style: GuType.h3.copyWith(
                    fontSize: small ? 13 : 14,
                    fontWeight: FontWeight.w500,
                    color: fg,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
