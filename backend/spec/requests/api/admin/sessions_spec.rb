require "rails_helper"

RSpec.describe "Api::Admin::Sessions", type: :request do
  let!(:org) { create(:organization) }

  describe "GET /api/admin/session" do
    context "認証済みの場合" do
      before { sign_in_as_admin }

      it "200を返す" do
        get api_admin_session_path, as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context "未認証の場合" do
      it "401を返す" do
        get api_admin_session_path, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /api/admin/session" do
    context "正しいパスワードの場合" do
      it "200を返す" do
        post api_admin_session_path, params: { password: "admin_pass" }, as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context "誤ったパスワードの場合" do
      it "401を返す" do
        post api_admin_session_path, params: { password: "wrong" }, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/admin/session" do
    before { sign_in_as_admin }

    it "204を返す" do
      delete api_admin_session_path, as: :json
      expect(response).to have_http_status(:no_content)
    end
  end
end
