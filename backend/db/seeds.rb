# 冪等性を保つ: 既存レコードがあればスキップ
if Organization.exists?
  puts "Organization already exists. Skipping seed."
else
  org = Organization.create!(
    name:            ENV.fetch("SEED_ORG_NAME",       "○○自治会"),
    member_password: ENV.fetch("SEED_MEMBER_PASSWORD", "member1234"),
    leader_password: ENV.fetch("SEED_LEADER_PASSWORD", "leader1234"),
    admin_password:  ENV.fetch("SEED_ADMIN_PASSWORD",  "admin1234")
  )
  puts "Created organization: #{org.name} (id: #{org.id})"
  puts "  member_password : #{ENV.fetch('SEED_MEMBER_PASSWORD', 'member1234')}"
  puts "  leader_password : #{ENV.fetch('SEED_LEADER_PASSWORD', 'leader1234')}"
  puts "  admin_password  : #{ENV.fetch('SEED_ADMIN_PASSWORD',  'admin1234')}"
  puts "  ⚠️  Please change all passwords immediately in production."
end
