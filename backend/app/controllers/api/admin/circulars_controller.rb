module Api
  module Admin
    class CircularsController < Api::Admin::BaseController
      before_action :set_circular, only: [ :show, :update, :destroy ]

      def index
        scope = current_organization.circulars
        scope = apply_filters(scope)
        scope = apply_status_filter(scope, params[:status]) if params[:status].present?
        scope = scope.order(created_at: :desc)

        circulars, pagination = paginate(scope, page: params[:page])

        render json: {
          circulars: circulars.map { |c| circular_summary(c) },
          pagination: pagination
        }
      end

      def show
        render json: circular_detail(@circular)
      end

      def create
        circular = current_organization.circulars.build(circular_params)
        circular.published_at = resolve_published_at(params[:status], params[:scheduled_at], circular.published_at)

        if circular.save
          attach_files(circular, params[:files])
          render json: circular_detail(circular), status: :created
        else
          render_errors(circular.errors.full_messages)
        end
      end

      def update
        @circular.assign_attributes(circular_status_params)
        @circular.published_at = resolve_published_at(params[:status], params[:scheduled_at], @circular.published_at)

        if @circular.save
          attach_files(@circular, params[:files])
          remove_attachments(@circular, params[:remove_file_ids])
          render json: circular_detail(@circular)
        else
          render_errors(@circular.errors.full_messages)
        end
      end

      def destroy
        @circular.destroy!
        head :no_content
      end

      private

      def set_circular
        @circular = current_organization.circulars.find(params[:id])
      end

      def circular_params
        permitted = params.permit(:title, :target_type, :status)
        permitted[:status] = "published" if permitted[:status] == "scheduled"
        permitted
      end

      def circular_status_params
        permitted = params.permit(:status)
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
          scope = scope.where("title ILIKE ?", kw)
        end
        scope = scope.where(target_type: params[:target_type]) if params[:target_type].present?
        scope = scope.where("EXTRACT(YEAR FROM created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Tokyo') = ?", params[:year]) if params[:year].present?
        scope = scope.where("EXTRACT(MONTH FROM created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Tokyo') = ?", params[:month]) if params[:month].present?
        scope
      end

      def circular_summary(circular)
        {
          id: circular.id,
          title: circular.title,
          target_type: circular.target_type,
          status: circular.status,
          scheduled_at: circular.scheduled_at,
          published_at: circular.status == "scheduled" ? nil : circular.published_at
        }
      end

      def attach_files(circular, files)
        return if files.blank?
        Array(files).each { |f| circular.files.attach(f) }
      end

      def remove_attachments(circular, ids)
        return if ids.blank?
        circular.files.where(id: Array(ids)).each(&:purge_later)
      end

      def circular_detail(circular)
        detail = circular_summary(circular)
        detail[:files] = circular.files.map { |f| attachment_json(f) }
        detail
      end

      def attachment_json(attachment)
        blob = attachment.blob
        {
          id: attachment.id,
          filename: blob.filename.to_s,
          content_type: blob.content_type,
          byte_size: blob.byte_size,
          file_url: Rails.application.routes.url_helpers.rails_blob_url(attachment, only_path: true),
          file_type: blob.content_type.start_with?("image/") ? "image" : "pdf"
        }
      end
    end
  end
end
