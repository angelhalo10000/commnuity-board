module Api
  module Admin
    class BaseController < Api::BaseController
      before_action :require_admin_session

      private

      def require_admin_session
        unless session[:admin_authenticated]
          render_errors([ "管理者認証が必要です" ], status: :unauthorized)
        end
      end
    end
  end
end
