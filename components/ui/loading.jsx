import React from 'react';
import { Loader2, FileText, Users, Zap, Wifi, WifiOff } from 'lucide-react';

// Main loading component with different variants
export const Loading = ({ 
  variant = 'default', 
  size = 'md', 
  message = 'Loading...', 
  submessage = null,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerSizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  if (variant === 'fullscreen') {
    return (
      <div className={`fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{message}</h3>
              {submessage && (
                <p className="text-gray-600 text-sm">{submessage}</p>
              )}
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'workspace') {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Users className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{message}</h3>
              {submessage && (
                <p className="text-gray-600 text-sm">{submessage}</p>
              )}
            </div>
            
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-150"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        <span className="text-gray-700">{message}</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-lg border shadow-sm ${containerSizes[size]} ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
          <div className="text-center">
            <p className="font-medium text-gray-800">{message}</p>
            {submessage && (
              <p className="text-sm text-gray-600 mt-1">{submessage}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center justify-center ${containerSizes[size]} ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        <p className="text-gray-700 text-sm">{message}</p>
      </div>
    </div>
  );
};

// Skeleton loading components
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border p-4 animate-pulse ${className}`}>
    <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export const SkeletonList = ({ items = 3, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {[...Array(items)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border animate-pulse">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{
        width: `${Math.random() * 40 + 60}%`
      }}></div>
    ))}
  </div>
);

// AI Generation specific loading
export const AIGenerationLoading = ({ className = '' }) => (
  <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
    <div className="relative mb-6">
      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
        <Zap className="w-8 h-8 text-white animate-pulse" />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
    </div>
    
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        AI is generating your content...
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        This may take a few moments
      </p>
    </div>
    
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-300"></div>
    </div>
  </div>
);

// Connection loading for Liveblocks
export const ConnectionLoading = ({ className = '', isConnecting = true }) => (
  <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            {isConnecting ? (
              <Wifi className="w-8 h-8 text-white animate-pulse" />
            ) : (
              <WifiOff className="w-8 h-8 text-white" />
            )}
          </div>
          <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${isConnecting ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {isConnecting ? 'Connecting to workspace...' : 'Connection Failed'}
          </h3>
          <p className="text-gray-600 text-sm">
            {isConnecting ? 'Setting up real-time collaboration' : 'Unable to establish connection'}
          </p>
        </div>
        
        {isConnecting && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Fast loading for quick operations
export const QuickLoading = ({ message = 'Loading...', className = '' }) => (
  <div className={`flex items-center justify-center p-4 ${className}`}>
    <div className="flex items-center space-x-3">
      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-gray-700 text-sm">{message}</span>
    </div>
  </div>
);

export default Loading;