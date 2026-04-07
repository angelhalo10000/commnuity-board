require "rails_helper"

RSpec.describe "Api::Admin::Circulars", type: :request do
  let!(:org) { create(:organization) }

  context "未認証の場合" do
    it "401を返す" do
      get api_admin_circulars_path, as: :json
      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "管理者認証済みの場合" do
    before { sign_in_as_admin }

    describe "GET /api/admin/circulars" do
      let!(:circular1) { create(:circular, :published, organization: org, title: "公開回覧") }
      let!(:circular2) { create(:circular, organization: org, title: "下書き回覧") }

      it "200と回覧一覧を返す" do
        get api_admin_circulars_path, as: :json
        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json["circulars"].size).to eq(2)
        expect(json["pagination"]).to include("current_page", "total_pages", "total_count")
      end

      it "statusフィルタが機能する" do
        get api_admin_circulars_path, params: { status: "draft" }
        json = response.parsed_body
        titles = json["circulars"].map { |c| c["title"] }
        expect(titles).to include("下書き回覧")
        expect(titles).not_to include("公開回覧")
      end

      it "keywordフィルタが機能する" do
        get api_admin_circulars_path, params: { keyword: "公開" }
        expect(response.parsed_body["circulars"].size).to eq(1)
      end
    end

    describe "POST /api/admin/circulars" do
      let(:valid_params) { { title: "新しい回覧", target_type: "all", status: "draft" } }

      it "201で回覧を作成する" do
        post api_admin_circulars_path, params: valid_params, as: :json
        expect(response).to have_http_status(:created)
        expect(response.parsed_body["title"]).to eq("新しい回覧")
      end

      it "publishedステータスでpublished_atが自動設定される" do
        post api_admin_circulars_path, params: valid_params.merge(status: "published"), as: :json
        expect(response.parsed_body["published_at"]).to be_present
      end

      it "タイトルなしで422を返す" do
        post api_admin_circulars_path, params: valid_params.merge(title: ""), as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    describe "PATCH /api/admin/circulars/:id" do
      let!(:circular) { create(:circular, organization: org) }

      it "200でステータスを更新する" do
        patch api_admin_circular_path(circular), params: { status: "published" }, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["status"]).to eq("published")
      end
    end

    describe "DELETE /api/admin/circulars/:id" do
      let!(:circular) { create(:circular, organization: org) }

      it "204で回覧を削除する" do
        delete api_admin_circular_path(circular), as: :json
        expect(response).to have_http_status(:no_content)
        expect(Circular.find_by(id: circular.id)).to be_nil
      end
    end
  end
end
