class Organization < ApplicationRecord
  has_many :notices, dependent: :destroy
  has_many :circulars, dependent: :destroy
  has_many :blocks, dependent: :destroy

  has_secure_password :member_password
  has_secure_password :leader_password
  has_secure_password :admin_password

  validates :name, presence: true
  validate :passwords_must_differ

  private

  def passwords_must_differ
    new_passwords = {
      admin: admin_password,
      leader: leader_password,
      member: member_password
    }

    new_passwords.compact.each do |role, password|
      new_passwords.keys.excluding(role).each do |other_role|
        if authenticate(password, other_role)
          errors.add(:base, 'パスワードは変更できせませんでした再設定してください')
          return
        end
      end
    end
  end

  def authenticate(password, role)
    public_send(:"authenticate_#{role}_password", password)
  end
end
