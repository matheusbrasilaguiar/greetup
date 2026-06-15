class ProductModel {
  final String id;
  final String name;
  final String? description;
  final String category;
  final bool active;

  const ProductModel({
    required this.id,
    required this.name,
    required this.category,
    required this.active,
    this.description,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) => ProductModel(
    id:          json['id'],
    name:        json['name'],
    description: json['description'],
    category:    json['category'],
    active:      json['active'] ?? true,
  );
}
