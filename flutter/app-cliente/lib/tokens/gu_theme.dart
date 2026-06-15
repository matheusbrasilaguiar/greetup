import 'package:flutter/material.dart';
import 'gu_colors.dart';
import 'gu_type.dart';

ThemeData buildGuTheme() {
  final base = ThemeData(useMaterial3: true, brightness: Brightness.light);
  return base.copyWith(
    scaffoldBackgroundColor: GuColors.cream50,
    colorScheme: base.colorScheme.copyWith(
      primary: GuColors.bordeaux700,
      surface: GuColors.cream100,
      onSurface: GuColors.ink900,
      error: GuColors.danger,
    ),
    textTheme: TextTheme(
      displaySmall:  GuType.display,
      headlineLarge: GuType.h1,
      titleLarge:    GuType.h2,
      titleMedium:   GuType.h3,
      bodyMedium:    GuType.body,
      bodySmall:     GuType.bodySm,
      labelSmall:    GuType.caption,
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: GuColors.cream50,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      hintStyle: GuType.body.copyWith(color: GuColors.ink300),
      border:             _border(GuColors.cream200),
      enabledBorder:      _border(GuColors.cream200),
      focusedBorder:      _border(GuColors.bordeaux700),
      errorBorder:        _border(const Color(0xFFEF4444)),
      focusedErrorBorder: _border(const Color(0xFFEF4444)),
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: GuColors.cream50,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: GuType.h2,
      iconTheme: const IconThemeData(color: GuColors.ink900),
    ),
    dividerColor: GuColors.cream200,
    extensions: const [GuStatusColors.standard],
  );
}

OutlineInputBorder _border(Color color) => OutlineInputBorder(
  borderRadius: BorderRadius.circular(6),
  borderSide: BorderSide(color: color, width: 1.5),
);
