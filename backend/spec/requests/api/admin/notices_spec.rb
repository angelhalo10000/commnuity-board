require "rails_helper"

RSpec.describe "Api::Admin::Notices", type: :request do
  let!(:org) { create(:organization) }

  context "未認証の場合" do
    it "401を返す" do
      get api_admin_notices_path, as: :json
      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "管理者認証済みの場合" do
    before { sign_in_as_admin }

    describe "GET /api/admin/notices" do
      let!(:notice1) { create(:notice, :published, organization: org, title: "公開記事") }
      let!(:notice2) { create(:notice, organization: org, title: "下書き記事") }

      it "200とお知らせ一覧を返す" do
        get api_admin_notices_path, as: :json
        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json["notices"].size).to eq(2)
        expect(json["pagination"]).to include("current_page", "total_pages", "total_count")
      end

      it "statusフィルタが機能する" do
        get api_admin_notices_path, params: { status: "published" }, as: :json
        json = response.parsed_body
        expect(json["notices"].map { |n| n["title"] }).to include("公開記事")
        expect(json["notices"].map { |n| n["title"] }).not_to include("下書き記事")
      end

      it "keywordフィルタが機能する" do
        get api_admin_notices_path, params: { keyword: "公開" }, as: :json
        json = response.parsed_body
        expect(json["notices"].size).to eq(1)
        expect(json["notices"].first["title"]).to eq("公開記事")
      end
    end

    describe "GET /api/admin/notices/:id" do
      let!(:notice) { create(:notice, :published, organization: org) }

      it "200とお知らせ詳細を返す" do
        get api_admin_notice_path(notice), as: :json
        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json["id"]).to eq(notice.id)
        expect(json).to include("body", "attachments")
      end

      it "存在しないIDで404を返す" do
        get api_admin_notice_path("nonexistent"), as: :json
        expect(response).to have_http_status(:not_found)
      end
    end

    describe "POST /api/admin/notices" do
      let(:valid_params) do
        { title: "新しいお知らせ", body: "本文", target_type: "all", status: "draft" }
      end

      it "201とお知らせを作成する" do
        post api_admin_notices_path, params: valid_params, as: :json
        expect(response).to have_http_status(:created)
        expect(response.parsed_body["title"]).to eq("新しいお知らせ")
      end

      it "publishedステータスでpublished_atが自動設定される" do
        post api_admin_notices_path, params: valid_params.merge(status: "published"), as: :json
        expect(response.parsed_body["published_at"]).to be_present
      end

      it "タイトルなしで422を返す" do
        post api_admin_notices_path, params: valid_params.merge(title: ""), as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    describe "PATCH /api/admin/notices/:id" do
      let!(:notice) { create(:notice, organization: org) }

      it "200とお知らせを更新する" do
        patch api_admin_notice_path(notice), params: { title: "更新タイトル" }, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["title"]).to eq("更新タイトル")
      end

      it "draftからpublishedに変更するとpublished_atが設定される" do
        patch api_admin_notice_path(notice), params: { status: "published" }, as: :json
        expect(response.parsed_body["published_at"]).to be_present
      end
    end

    describe "DELETE /api/admin/notices/:id" do
      let!(:notice) { create(:notice, organization: org) }

      it "204でお知らせを削除する" do
        delete api_admin_notice_path(notice), as: :json
        expect(response).to have_http_status(:no_content)
        expect(Notice.find_by(id: notice.id)).to be_nil
      end
    end
  end
end
