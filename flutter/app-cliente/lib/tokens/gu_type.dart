import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'gu_colors.dart';

abstract final class GuType {
  static final display = GoogleFonts.sora(
    fontSize: 32, fontWeight: FontWeight.w700, height: 1.0,
    letterSpacing: -0.9, color: GuColors.ink900);

  static final h1 = GoogleFonts.sora(
    fontSize: 28, fontWeight: FontWeight.w700, height: 1.04,
    letterSpacing: -0.62, color: GuColors.ink900);

  static final h2 = GoogleFonts.sora(
    fontSize: 22, fontWeight: FontWeight.w600, height: 1.1,
    letterSpacing: -0.33, color: GuColors.ink900);

  static final h3 = GoogleFonts.sora(
    fontSize: 16, fontWeight: FontWeight.w500, height: 1.2,
    letterSpacing: -0.08, color: GuColors.ink900);

  static final body = GoogleFonts.sora(
    fontSize: 14, fontWeight: FontWeight.w400, height: 1.6,
    color: GuColors.ink700);

  static final bodySm = GoogleFonts.sora(
    fontSize: 13, fontWeight: FontWeight.w400, height: 1.5,
    color: GuColors.ink700);

  static final caption = GoogleFonts.jetBrainsMono(
    fontSize: 11, fontWeight: FontWeight.w400, height: 1.4,
    letterSpacing: 2.0, color: GuColors.ink500);

  static final editorial = GoogleFonts.cormorantGaramond(
    fontSize: 32, fontStyle: FontStyle.italic, fontWeight: FontWeight.w400,
    height: 1.05, color: GuColors.bordeaux700);
}
