class Circular < ApplicationRecord
  include Publishable

  belongs_to :organization

  has_many_attached :files

  enum :target_type, { all: "all", leaders: "leaders" }, prefix: :target
end
