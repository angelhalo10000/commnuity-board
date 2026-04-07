require "rails_helper"

RSpec.describe Notice, type: :model do
  describe "バリデーション" do
    it "必須項目が揃っていれば有効" do
      expect(build(:notice)).to be_valid
    end

    it "タイトルが空だと無効" do
      expect(build(:notice, title: "")).not_to be_valid
    end

    it "scheduledステータスでscheduled_atが空だと無効" do
      expect(build(:notice, :scheduled, scheduled_at: nil)).not_to be_valid
    end

    it "scheduledステータスでscheduled_atがあれば有効" do
      expect(build(:notice, :scheduled)).to be_valid
    end
  end

  describe ".visible_to" do
    let(:org) { create(:organization) }
    let!(:published_all)     { create(:notice, :published, organization: org, target_type: "all") }
    let!(:published_leaders) { create(:notice, :published, :leaders_only, organization: org) }
    let!(:draft)             { create(:notice, organization: org) }

    it "memberには全員向け公開記事のみ返す" do
      result = Notice.visible_to(:member)
      expect(result).to include(published_all)
      expect(result).not_to include(published_leaders)
      expect(result).not_to include(draft)
    end

    it "leaderには全員向け・班長向け両方の公開記事を返す" do
      result = Notice.visible_to(:leader)
      expect(result).to include(published_all, published_leaders)
      expect(result).not_to include(draft)
    end
  end
end
