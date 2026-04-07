module Api
  module Viewer
    class BaseController < Api::BaseController
      before_action :require_viewer_session

      private

      def viewer_role
        session[:viewer_role]&.to_sym
      end

      def require_viewer_session
        unless viewer_role.in?([ :member, :leader ])
          render_errors([ "認証が必要です" ], status: :unauthorized)
        end
      end

      def leader?
        viewer_role == :leader
      end
    end
  end
end
