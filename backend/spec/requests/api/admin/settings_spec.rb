require "rails_helper"

RSpec.describe "Api::Admin::Settings", type: :request do
  let!(:org) { create(:organization) }

  context "未認証の場合" do
    it "401を返す" do
      get api_admin_settings_path, as: :json
      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "管理者認証済みの場合" do
    before { sign_in_as_admin }

    describe "GET /api/admin/settings" do
      it "200と組織名を返す" do
        get api_admin_settings_path, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["organization_name"]).to eq(org.name)
      end
    end

    describe "PATCH /api/admin/settings/organization" do
      it "204で組織名を更新する" do
        patch organization_api_admin_settings_path, params: { name: "新しい自治会名" }, as: :json
        expect(response).to have_http_status(:no_content)
        expect(org.reload.name).to eq("新しい自治会名")
      end
    end

    describe "PATCH /api/admin/settings/member_password" do
      it "正しい現在パスワードで204を返す" do
        patch member_password_api_admin_settings_path,
          params: { current_password: "member_pass", password: "new_member_pass" },
          as: :json
        expect(response).to have_http_status(:no_content)
      end

      it "誤った現在パスワードで422を返す" do
        patch member_password_api_admin_settings_path,
          params: { current_password: "wrong", password: "new_pass" },
          as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    describe "PATCH /api/admin/settings/leader_password" do
      it "正しい現在パスワードで204を返す" do
        patch leader_password_api_admin_settings_path,
          params: { current_password: "leader_pass", password: "new_leader_pass" },
          as: :json
        expect(response).to have_http_status(:no_content)
      end

      it "誤った現在パスワードで422を返す" do
        patch leader_password_api_admin_settings_path,
          params: { current_password: "wrong", password: "new_pass" },
          as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    describe "PATCH /api/admin/settings/admin_password" do
      it "正しい現在パスワードで204を返す" do
        patch admin_password_api_admin_settings_path,
          params: { current_password: "admin_pass", password: "new_admin_pass" },
          as: :json
        expect(response).to have_http_status(:no_content)
      end

      it "誤った現在パスワードで422を返す" do
        patch admin_password_api_admin_settings_path,
          params: { current_password: "wrong", password: "new_pass" },
          as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
