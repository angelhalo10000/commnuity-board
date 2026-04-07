FactoryBot.define do
  factory :organization do
    name { "テスト自治会" }
    member_password { "member_pass" }
    leader_password { "leader_pass" }
    admin_password  { "admin_pass" }
  end
end
