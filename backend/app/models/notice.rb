class Notice < ApplicationRecord
  belongs_to :organization

  has_many_attached :attachments

  enum :target_type, { all: "all", leaders: "leaders" }, prefix: :target
  enum :status, { draft: "draft", published: "published", archived: "archived" }, prefix: false

  validates :title, presence: true
  validates :target_type, presence: true
  validates :status, presence: true

  scope :published_for, ->(role) {
    base = published.where(organization_id: organization_id).where("published_at <= ?", Time.current)
    role == :leader ? base : base.where(target_type: "all")
  }

  scope :visible_to, ->(role) {
    relation = published.where("published_at <= ?", Time.current)
    relation = relation.where(target_type: "all") unless role == :leader
    relation
  }
end
