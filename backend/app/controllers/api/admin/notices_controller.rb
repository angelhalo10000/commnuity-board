module Api
  module Admin
    class NoticesController < Api::Admin::BaseController
      before_action :set_notice, only: [ :show, :update, :destroy ]

      def index
        scope = current_organization.notices
        scope = apply_filters(scope)
        scope = apply_status_filter(scope, params[:status]) if params[:status].present?
        scope = scope.order(created_at: :desc)

        notices, pagination = paginate(scope, page: params[:page])

        render json: {
          notices: notices.map { |n| notice_summary(n) },
          pagination: pagination
        }
      end

      def show
        render json: notice_detail(@notice)
      end

      def create
        notice = current_organization.notices.build(notice_params)
        notice.published_at = resolve_published_at(params[:status], params[:scheduled_at], notice.published_at)

        if notice.save
          attach_files(notice, params[:attachments])
          render json: notice_detail(notice), status: :created
        else
          render_errors(notice.errors.full_messages)
        end
      end

      def update
        @notice.assign_attributes(notice_params)
        @notice.published_at = resolve_published_at(params[:status], params[:scheduled_at], @notice.published_at)

        if @notice.save
          attach_files(@notice, params[:attachments])
          remove_attachments(@notice, params[:remove_attachment_ids])
          render json: notice_detail(@notice)
        else
          render_errors(@notice.errors.full_messages)
        end
      end

      def destroy
        @notice.destroy!
        head :no_content
      end

      private

      def set_notice
        @notice = current_organization.notices.find(params[:id])
      end

      def notice_params
        permitted = params.permit(:title, :body, :target_type, :status)
        permitted[:status] = "published" if permitted[:status] == "scheduled"
        permitted
      end

      def resolve_published_at(requested_status, scheduled_at, current_published_at)
        case requested_status
        when "scheduled" then scheduled_at.presence
        when "published"  then current_published_at&.past? ? current_published_at : Time.current
        else current_published_at
        end
      end

      def attach_files(notice, files)
        return if files.blank?
        Array(files).each do |file|
          notice.attachments.attach(file)
        end
      end

      def remove_attachments(notice, ids)
        return if ids.blank?
        notice.attachments.where(id: Array(ids)).each(&:purge_later)
      end

      def apply_status_filter(scope, status)
        case status
        when "scheduled" then scope.published.where("published_at > ?", Time.current)
        when "published"  then scope.published.where("published_at <= ?", Time.current)
        else scope.where(status: status)
        end
      end

      def apply_filters(scope)
        if params[:keyword].present?
          kw = "%#{params[:keyword]}%"
          scope = scope.where("title ILIKE ? OR body ILIKE ?", kw, kw)
        end
        scope = scope.where("EXTRACT(YEAR FROM created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Tokyo') = ?", params[:year]) if params[:year].present?
        scope = scope.where("EXTRACT(MONTH FROM created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Tokyo') = ?", params[:month]) if params[:month].present?
        scope
      end

      def notice_summary(notice)
        {
          id: notice.id,
          title: notice.title,
          target_type: notice.target_type,
          status: notice.status,
          scheduled_at: notice.scheduled_at,
          published_at: notice.status == "scheduled" ? nil : notice.published_at
        }
      end

      def notice_detail(notice)
        notice_summary(notice).merge(
          body: notice.body,
          attachments: notice.attachments.map { |a| attachment_json(a) },
          created_at: notice.created_at,
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
