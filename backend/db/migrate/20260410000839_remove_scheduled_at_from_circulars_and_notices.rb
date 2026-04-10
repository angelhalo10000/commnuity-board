class RemoveScheduledAtFromCircularsAndNotices < ActiveRecord::Migration[8.1]
  def change
    remove_column :circulars, :scheduled_at, :timestamptz
    remove_column :notices, :scheduled_at, :timestamptz
  end
end
