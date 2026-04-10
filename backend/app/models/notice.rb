class Notice < ApplicationRecord
  include Publishable

  belongs_to :organization

  has_many_attached :attachments

  enum :target_type, { all: "all", leaders: "leaders" }, prefix: :target

  scope :published_for, ->(role) {
    base = published.where(organization_id: organization_id).where("published_at <= ?", Time.current)
    role == :leader ? base : base.where(target_type: "all")
  }
end
