class UserModel {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? operatorFunction;
  final String token;

  const UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.token,
    this.operatorFunction,
  });

  factory UserModel.fromJson(Map<String, dynamic> json, String token) {
    return UserModel(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      role: json['role'] as String,
      operatorFunction: json['operatorFunction'] as String?,
      token: token,
    );
  }
}
