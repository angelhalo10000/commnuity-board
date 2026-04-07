require "rails_helper"

RSpec.describe "Api::Viewer::Sessions", type: :request do
  let!(:org) { create(:organization) }

  describe "GET /api/viewer/session" do
    context "会員としてログイン済みの場合" do
      before { sign_in_as_viewer }

      it "200とroleを返す" do
        get api_viewer_session_path, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["role"]).to eq("member")
      end
    end

    context "未認証の場合" do
      it "401を返す" do
        get api_viewer_session_path, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /api/viewer/session" do
    context "会員パスワードの場合" do
      it "200とrole=memberを返す" do
        post api_viewer_session_path, params: { password: "member_pass" }, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["role"]).to eq("member")
      end
    end

    context "班長パスワードの場合" do
      it "200とrole=leaderを返す" do
        post api_viewer_session_path, params: { password: "leader_pass" }, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["role"]).to eq("leader")
      end
    end

    context "誤ったパスワードの場合" do
      it "401を返す" do
        post api_viewer_session_path, params: { password: "wrong" }, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/viewer/session" do
    before { sign_in_as_viewer }

    it "204を返す" do
      delete api_viewer_session_path, as: :json
      expect(response).to have_http_status(:no_content)
    end
  end
end
