class CustomerModel {
  final String id;
  final String name;
  final String? email;
  final String? phone;
  final String? employer;

  const CustomerModel({
    required this.id,
    required this.name,
    this.email,
    this.phone,
    this.employer,
  });

  factory CustomerModel.fromJson(Map<String, dynamic> json) => CustomerModel(
    id:       json['id'],
    name:     json['name'],
    email:    json['email'],
    phone:    json['phone'],
    employer: json['employer'],
  );

  Map<String, dynamic> toJson() => {
    'name':     name,
    if (email    != null) 'email':    email,
    if (phone    != null) 'phone':    phone,
    if (employer != null) 'employer': employer,
  };
}
