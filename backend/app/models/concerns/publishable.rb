module Publishable
  extend ActiveSupport::Concern

  included do
    enum :status, { draft: "draft", published: "published", archived: "archived" }, prefix: false

    validates :title, presence: true
    validates :target_type, presence: true
    validates :status, presence: true

    scope :visible_to, ->(role) {
      relation = published.where("published_at <= ?", Time.current)
      relation = relation.where(target_type: "all") unless role == :leader
      relation
    }

    def status
      val = read_attribute(:status)
      return "scheduled" if val == "published" && published_at&.future?
      val
    end

    def scheduled_at
      published_at if read_attribute(:status) == "published" && published_at&.future?
    end
  end
end
