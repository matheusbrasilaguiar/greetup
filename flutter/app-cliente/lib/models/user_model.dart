class UserModel {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? operatorFunction;
  final String companyId;

  const UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.companyId,
    this.operatorFunction,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id:               json['id'],
    name:             json['name'],
    email:            json['email'],
    role:             json['role'],
    companyId:        json['companyId'],
    operatorFunction: json['operatorFunction'],
  );
}
