import 'package:flutter/material.dart';

// ─── Paleta ──────────────────────────────────────────────────────────────────

abstract final class GuColors {
  static const bordeaux900 = Color(0xFF2E1116);
  static const bordeaux800 = Color(0xFF4A1A24);
  static const bordeaux700 = Color(0xFF6B2331);
  static const bordeaux500 = Color(0xFF92465A);
  static const bordeaux300 = Color(0xFFD6A8B0);

  static const champagne = Color(0xFFD9B58A);
  static const cream50   = Color(0xFFFBF7EF);
  static const cream100  = Color(0xFFF5EEDE);
  static const cream200  = Color(0xFFECE2CC);

  static const ink900 = Color(0xFF1F1A18);
  static const ink700 = Color(0xFF4A423E);
  static const ink500 = Color(0xFF7A736E);
  static const ink300 = Color(0xFFB0AAA5);

  static const danger   = Color(0xFFB91C1C);
  static const dangerHi = Color(0xFF991717);
}

// ─── Espaçamento (grade de 4px) ──────────────────────────────────────────────

abstract final class GuSpacing {
  static const s1  = 4.0;
  static const s2  = 6.0;
  static const s3  = 8.0;
  static const s4  = 12.0;
  static const s5  = 14.0;
  static const s6  = 18.0;
  static const s7  = 24.0;
  static const s8  = 32.0;
  static const s10 = 48.0;
  static const s16 = 64.0;
}

// ─── Raio de canto ───────────────────────────────────────────────────────────

abstract final class GuRadius {
  static const sm   = 5.0;
  static const md   = 6.0;
  static const lg   = 8.0;
  static const xl   = 10.0;
  static const pill = 999.0;
}

// ─── Sombras ─────────────────────────────────────────────────────────────────

abstract final class GuShadows {
  // 0 1px 3px rgba(31,26,24,.08)
  static const card = BoxShadow(
    color: Color(0x141F1A18),
    blurRadius: 3,
    offset: Offset(0, 1),
  );

  // 0 6px 20px -8px rgba(46,17,22,.18)
  static const raised = BoxShadow(
    color: Color(0x2E2E1116),
    blurRadius: 20,
    spreadRadius: -8,
    offset: Offset(0, 6),
  );
}

// ─── Status de item ──────────────────────────────────────────────────────────

class GuStatusColor {
  final Color bg, tx, br;
  const GuStatusColor(this.bg, this.tx, this.br);
}

abstract final class GuStatus {
  static const pending   = GuStatusColor(Color(0xFFFFF8E7), Color(0xFF92610A), Color(0xFFD9B58A));
  static const preparing = GuStatusColor(Color(0xFFEEF2FF), Color(0xFF3730A3), Color(0xFF6366F1));
  static const ready     = GuStatusColor(Color(0xFFF0FDF4), Color(0xFF15803D), Color(0xFF22C55E));
  static const delivered = GuStatusColor(Color(0xFFF5EEDE), Color(0xFF4A423E), Color(0xFFB0AAA5));
  static const canceled  = GuStatusColor(Color(0xFFFEF2F2), Color(0xFFB91C1C), Color(0xFFEF4444));

  // Estados de mesa — OPEN: surface neutra; OCCUPIED: bordô soft; CLOSED: entregue
  static const tableOpen     = GuStatusColor(GuColors.cream100, GuColors.ink700, GuColors.cream200);
  static const tableOccupied = GuStatusColor(Color(0xFFFBEEF0), GuColors.bordeaux800, GuColors.bordeaux300);
  static const tableMyTable  = GuStatusColor(Color(0xFFFBEEF0), GuColors.bordeaux700, GuColors.bordeaux700);
  static const tableClosed   = GuStatusColor(GuColors.cream100, GuColors.ink500, GuColors.cream200);

  static GuStatusColor fromItemStatus(String status) {
    switch (status) {
      case 'PENDENTE':   return pending;
      case 'EM_PREPARO': return preparing;
      case 'PRONTO':     return ready;
      case 'ENTREGUE':   return delivered;
      default:           return canceled;
    }
  }

  static GuStatusColor fromTableStatus(String status, {bool isMyTable = false}) {
    if (isMyTable && status == 'OCCUPIED') return tableMyTable;
    switch (status) {
      case 'OPEN':     return tableOpen;
      case 'OCCUPIED': return tableOccupied;
      default:         return tableClosed;
    }
  }
}

// ─── ThemeExtension de status ─────────────────────────────────────────────────

@immutable
class GuStatusColors extends ThemeExtension<GuStatusColors> {
  final GuStatusColor pending;
  final GuStatusColor preparing;
  final GuStatusColor ready;
  final GuStatusColor delivered;
  final GuStatusColor canceled;

  const GuStatusColors({
    required this.pending,
    required this.preparing,
    required this.ready,
    required this.delivered,
    required this.canceled,
  });

  static const standard = GuStatusColors(
    pending:   GuStatus.pending,
    preparing: GuStatus.preparing,
    ready:     GuStatus.ready,
    delivered: GuStatus.delivered,
    canceled:  GuStatus.canceled,
  );

  @override
  GuStatusColors copyWith({
    GuStatusColor? pending,
    GuStatusColor? preparing,
    GuStatusColor? ready,
    GuStatusColor? delivered,
    GuStatusColor? canceled,
  }) => GuStatusColors(
    pending:   pending   ?? this.pending,
    preparing: preparing ?? this.preparing,
    ready:     ready     ?? this.ready,
    delivered: delivered ?? this.delivered,
    canceled:  canceled  ?? this.canceled,
  );

  @override
  GuStatusColors lerp(GuStatusColors? other, double t) => other ?? this;
}
