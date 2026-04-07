class Block < ApplicationRecord
  belongs_to :organization

  validates :name, presence: true
  validates :sort_order, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  default_scope { order(:sort_order) }
end
