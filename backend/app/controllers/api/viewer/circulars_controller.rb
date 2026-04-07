module Api
  module Viewer
    class CircularsController < Api::Viewer::BaseController
      def index
        scope = current_organization.circulars.visible_to(viewer_role)
        scope = apply_filters(scope)
        scope = scope.order(published_at: :desc)

        circulars, pagination = paginate(scope, page: params[:page])

        render json: {
          circulars: circulars.map { |c| circular_summary(c) },
          pagination: pagination
        }
      end

      def show
        circular = current_organization.circulars.published.find(params[:id])

        unless leader? || circular.target_all?
          return render_errors([ "アクセス権限がありません" ], status: :forbidden)
        end

        render json: circular_detail(circular)
      end

      private

      def apply_filters(scope)
        if params[:keyword].present?
          kw = "%#{params[:keyword]}%"
          scope = scope.where("title ILIKE ?", kw)
        end
        scope = scope.where("EXTRACT(YEAR FROM published_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Tokyo') = ?", params[:year]) if params[:year].present?
        scope = scope.where("EXTRACT(MONTH FROM published_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Tokyo') = ?", params[:month]) if params[:month].present?
        scope
      end

      def circular_summary(circular)
        {
          id: circular.id,
          title: circular.title,
          target_type: circular.target_type,
          published_at: circular.published_at,
          is_new: circular.published_at >= 30.days.ago
        }
      end

      def circular_detail(circular)
        summary = circular_summary(circular)
        return summary if circular.file.blank?

        blob = circular.file.blob
        file_type = blob.content_type.start_with?("image/") ? "image" : "pdf"

        circular_summary(circular).merge(
          file_url: Rails.application.routes.url_helpers.rails_blob_url(circular.file, only_path: true),
          file_type: file_type
        )
      end
    end
  end
end
