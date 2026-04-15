class AddCoveringIndexesToNoticesAndCirculars < ActiveRecord::Migration[8.1]
  def change
    add_index :notices, [:organization_id, :status, :target_type, :published_at],
              name: "index_notices_on_org_status_target_published"

    add_index :circulars, [:organization_id, :status, :target_type, :published_at],
              name: "index_circulars_on_org_status_target_published"
  end
end
