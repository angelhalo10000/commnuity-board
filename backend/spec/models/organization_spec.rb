require "rails_helper"

RSpec.describe Organization, type: :model do
  describe "バリデーション" do
    it "名前・各パスワードがあれば有効" do
      org = build(:organization)
      expect(org).to be_valid
    end

    it "名前が空だと無効" do
      org = build(:organization, name: "")
      expect(org).not_to be_valid
      expect(org.errors[:name]).to be_present
    end

    it "会員パスワードと班長パスワードが同じだと無効" do
      org = build(:organization, member_password: "same", leader_password: "same")
      expect(org).not_to be_valid
      expect(org.errors[:leader_password]).to be_present
    end
  end

  describe "パスワード認証" do
    subject(:org) { create(:organization) }

    it "正しい会員パスワードで認証できる" do
      expect(org.authenticate_member_password("member_pass")).to be_truthy
    end

    it "誤った会員パスワードは認証失敗" do
      expect(org.authenticate_member_password("wrong")).to be_falsey
    end

    it "正しい班長パスワードで認証できる" do
      expect(org.authenticate_leader_password("leader_pass")).to be_truthy
    end

    it "正しい管理者パスワードで認証できる" do
      expect(org.authenticate_admin_password("admin_pass")).to be_truthy
    end

    it "誤った管理者パスワードは認証失敗" do
      expect(org.authenticate_admin_password("wrong")).to be_falsey
    end
  end

  describe "パスワード変更時のバリデーション" do
    subject(:org) { create(:organization) }

    it "会員パスワードを班長パスワードと同じ値に変更すると無効" do
      org.member_password = "leader_pass"
      expect(org).not_to be_valid
      expect(org.errors[:member_password]).to be_present
    end

    it "班長パスワードを会員パスワードと同じ値に変更すると無効" do
      org.leader_password = "member_pass"
      expect(org).not_to be_valid
      expect(org.errors[:leader_password]).to be_present
    end
  end
end
