import 'package:flutter/material.dart';
import '../tokens/gu_colors.dart';
import '../tokens/gu_type.dart';

class GuInput extends StatelessWidget {
  final String label;
  final String? hint;
  final String? helper;
  final String? error;
  final bool obscure;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final TextInputType? keyboardType;
  final IconData? prefixIcon;
  final int? maxLines;

  const GuInput({
    super.key,
    required this.label,
    this.hint,
    this.helper,
    this.error,
    this.obscure = false,
    this.controller,
    this.onChanged,
    this.keyboardType,
    this.prefixIcon,
    this.maxLines = 1,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GuType.bodySm.copyWith(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: GuColors.ink700,
          ),
        ),
        const SizedBox(height: GuSpacing.s2),
        TextField(
          controller: controller,
          onChanged: onChanged,
          obscureText: obscure,
          keyboardType: keyboardType,
          maxLines: maxLines,
          style: GuType.body.copyWith(color: GuColors.ink900),
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: prefixIcon != null
                ? Icon(prefixIcon, size: GuSpacing.s5, color: GuColors.ink500)
                : null,
          ),
        ),
        if (error != null) ...[
          const SizedBox(height: GuSpacing.s1),
          Text(
            error!,
            style: GuType.caption.copyWith(color: GuColors.danger, letterSpacing: 0),
          ),
        ] else if (helper != null) ...[
          const SizedBox(height: GuSpacing.s1),
          Text(helper!, style: GuType.caption),
        ],
      ],
    );
  }
}
