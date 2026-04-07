class Notice < ApplicationRecord
  belongs_to :organization

  has_many_attached :attachments

  enum :target_type, { all: "all", leaders: "leaders" }, prefix: false
  enum :status, { draft: "draft", scheduled: "scheduled", published: "published", archived: "archived" }, prefix: false

  validates :title, presence: true
  validates :target_type, presence: true
  validates :status, presence: true
  validates :scheduled_at, presence: true, if: -> { scheduled? }

  scope :published_for, ->(role) {
    base = published.where(organization_id: organization_id)
    role == :leader ? base : base.where(target_type: "all")
  }

  scope :visible_to, ->(role) {
    relation = published
    relation = relation.where(target_type: "all") unless role == :leader
    relation
  }
end
