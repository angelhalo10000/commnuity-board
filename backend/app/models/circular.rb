class Circular < ApplicationRecord
  belongs_to :organization

  has_many_attached :files

  enum :target_type, { all: "all", leaders: "leaders" }, prefix: :target
  enum :status, { draft: "draft", published: "published", archived: "archived" }, prefix: false

  validates :title, presence: true
  validates :target_type, presence: true
  validates :status, presence: true

  scope :visible_to, ->(role) {
    relation = published.where("published_at <= ?", Time.current)
    relation = relation.where(target_type: "all") unless role == :leader
    relation
  }
end
