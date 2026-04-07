require "rails_helper"

RSpec.describe "Api::Viewer::Circulars", type: :request do
  let!(:org) { create(:organization) }

  context "未認証の場合" do
    it "401を返す" do
      get api_viewer_circulars_path, as: :json
      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "会員（member）としてログイン済みの場合" do
    before { sign_in_as_viewer }

    let!(:published_all)     { create(:circular, :published, organization: org, title: "全員向け") }
    let!(:published_leaders) { create(:circular, :published, :leaders_only, organization: org, title: "班長向け") }
    let!(:draft)             { create(:circular, organization: org) }

    describe "GET /api/viewer/circulars" do
      it "200と全員向け公開回覧のみ返す" do
        get api_viewer_circulars_path, as: :json
        expect(response).to have_http_status(:ok)
        titles = response.parsed_body["circulars"].map { |c| c["title"] }
        expect(titles).to include("全員向け")
        expect(titles).not_to include("班長向け")
      end
    end

    describe "GET /api/viewer/circulars/:id" do
      it "全員向け公開回覧を取得できる" do
        get api_viewer_circular_path(published_all), as: :json
        expect(response).to have_http_status(:ok)
      end

      it "班長向け回覧は403を返す" do
        get api_viewer_circular_path(published_leaders), as: :json
        expect(response).to have_http_status(:forbidden)
      end

      it "下書きは404を返す" do
        get api_viewer_circular_path(draft), as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  context "班長（leader）としてログイン済みの場合" do
    before { sign_in_as_leader }

    let!(:published_all)     { create(:circular, :published, organization: org, title: "全員向け") }
    let!(:published_leaders) { create(:circular, :published, :leaders_only, organization: org, title: "班長向け") }

    describe "GET /api/viewer/circulars" do
      it "全員向け・班長向け両方を返す" do
        get api_viewer_circulars_path, as: :json
        titles = response.parsed_body["circulars"].map { |c| c["title"] }
        expect(titles).to include("全員向け", "班長向け")
      end
    end

    describe "GET /api/viewer/circulars/:id" do
      it "班長向け回覧も取得できる" do
        get api_viewer_circular_path(published_leaders), as: :json
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
