class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  before_create :set_uuid

  private

  def set_uuid
    self.id ||= SecureRandom.uuid_v7
  end
end
