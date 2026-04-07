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
    return unless member_password_digest.present? && leader_password_digest.present?

    if BCrypt::Password.new(leader_password_digest) == member_password
      errors.add(:leader_password, "は会員パスワードと異なる値にしてください")
    end

    if BCrypt::Password.new(member_password_digest) == leader_password
      errors.add(:member_password, "は班長パスワードと異なる値にしてください")
    end
  end
end
