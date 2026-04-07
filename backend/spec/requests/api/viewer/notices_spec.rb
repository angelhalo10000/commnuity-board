require "rails_helper"

RSpec.describe "Api::Viewer::Notices", type: :request do
  let!(:org) { create(:organization) }

  context "未認証の場合" do
    it "401を返す" do
      get api_viewer_notices_path, as: :json
      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "会員（member）としてログイン済みの場合" do
    before { sign_in_as_viewer }

    let!(:published_all)     { create(:notice, :published, organization: org, title: "全員向け") }
    let!(:published_leaders) { create(:notice, :published, :leaders_only, organization: org, title: "班長向け") }
    let!(:draft)             { create(:notice, organization: org) }

    describe "GET /api/viewer/notices" do
      it "200と全員向け公開お知らせのみ返す" do
        get api_viewer_notices_path, as: :json
        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        titles = json["notices"].map { |n| n["title"] }
        expect(titles).to include("全員向け")
        expect(titles).not_to include("班長向け")
      end

      it "paginationが含まれる" do
        get api_viewer_notices_path, as: :json
        expect(response.parsed_body["pagination"]).to include("current_page", "total_pages", "total_count")
      end
    end

    describe "GET /api/viewer/notices/:id" do
      it "全員向け公開お知らせを取得できる" do
        get api_viewer_notice_path(published_all), as: :json
        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["id"]).to eq(published_all.id)
      end

      it "班長向けお知らせは403を返す" do
        get api_viewer_notice_path(published_leaders), as: :json
        expect(response).to have_http_status(:forbidden)
      end

      it "下書きは404を返す" do
        get api_viewer_notice_path(draft), as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  context "班長（leader）としてログイン済みの場合" do
    before { sign_in_as_leader }

    let!(:published_all)     { create(:notice, :published, organization: org, title: "全員向け") }
    let!(:published_leaders) { create(:notice, :published, :leaders_only, organization: org, title: "班長向け") }

    describe "GET /api/viewer/notices" do
      it "全員向け・班長向け両方を返す" do
        get api_viewer_notices_path, as: :json
        titles = response.parsed_body["notices"].map { |n| n["title"] }
        expect(titles).to include("全員向け", "班長向け")
      end
    end

    describe "GET /api/viewer/notices/:id" do
      it "班長向けお知らせも取得できる" do
        get api_viewer_notice_path(published_leaders), as: :json
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
