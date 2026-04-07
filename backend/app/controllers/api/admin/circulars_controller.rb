module Api
  module Admin
    class CircularsController < Api::Admin::BaseController
      before_action :set_circular, only: [ :update, :destroy ]

      def index
        scope = current_organization.circulars
        scope = apply_filters(scope)
        scope = scope.where(status: params[:status]) if params[:status].present?
        scope = scope.order(created_at: :desc)

        circulars, pagination = paginate(scope, page: params[:page])

        render json: {
          circulars: circulars.map { |c| circular_summary(c) },
          pagination: pagination
        }
      end

      def create
        circular = current_organization.circulars.build(circular_params)
        circular.published_at = Time.current if circular.published?

        if circular.save
          attach_files(circular, params[:files])
          render json: circular_detail(circular), status: :created
        else
          render_errors(circular.errors.full_messages)
        end
      end

      def update
        @circular.assign_attributes(circular_status_params)
        @circular.published_at ||= Time.current if @circular.published?

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
        params.permit(:title, :target_type, :status, :scheduled_at)
      end

      def circular_status_params
        params.permit(:status, :scheduled_at)
      end

      def apply_filters(scope)
        if params[:keyword].present?
          kw = "%#{params[:keyword]}%"
          scope = scope.where("title ILIKE ?", kw)
        end
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
          published_at: circular.published_at
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
