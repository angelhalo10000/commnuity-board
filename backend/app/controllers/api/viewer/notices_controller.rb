module Api
  module Viewer
    class NoticesController < Api::Viewer::BaseController
      def index
        scope = current_organization.notices.visible_to(viewer_role)
        scope = apply_filters(scope)
        scope = scope.order(published_at: :desc)

        notices, pagination = paginate(scope, page: params[:page])

        render json: {
          notices: notices.map { |n| notice_summary(n) },
          pagination: pagination
        }
      end

      def show
        notice = current_organization.notices.published.find(params[:id])

        unless leader? || notice.target_all?
          return render_errors([ "アクセス権限がありません" ], status: :forbidden)
        end

        render json: notice_detail(notice)
      end

      private

      def apply_filters(scope)
        if params[:keyword].present?
          kw = "%#{params[:keyword]}%"
          scope = scope.where("title ILIKE ? OR body ILIKE ?", kw, kw)
        end
        scope = scope.where("EXTRACT(YEAR FROM published_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Tokyo') = ?", params[:year]) if params[:year].present?
        scope = scope.where("EXTRACT(MONTH FROM published_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Tokyo') = ?", params[:month]) if params[:month].present?
        scope
      end

      def notice_summary(notice)
        {
          id: notice.id,
          title: notice.title,
          target_type: notice.target_type,
          published_at: notice.published_at,
          is_new: notice.published_at >= 30.days.ago
        }
      end

      def notice_detail(notice)
        notice_summary(notice).merge(
          body: notice.body,
          attachments: notice.attachments.map { |a| attachment_json(a) },
          updated_at: notice.updated_at
        )
      end

      def attachment_json(attachment)
        {
          id: attachment.id,
          filename: attachment.filename.to_s,
          content_type: attachment.content_type,
          byte_size: attachment.byte_size,
          file_url: Rails.application.routes.url_helpers.rails_blob_url(attachment, only_path: true)
        }
      end
    end
  end
end
