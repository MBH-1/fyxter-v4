import React from 'react';
import { RepairRequest } from '../lib/types';
import { Clock, MapPin, Wrench } from 'lucide-react';

interface RepairReviewProps {
  request: RepairRequest;
  onBack: () => void;
  onConfirm: () => void;
}

export function RepairReview({ request, onBack, onConfirm }: RepairReviewProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold">Review Repair Request</h1>
        <p className="text-gray-600">{request.model} - {request.repairType}</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Repair Details</h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Wrench size={16} className="text-gray-400" />
                <span>{request.repairType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span>{request.estimatedTime}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Service Location</h3>
            <div className="mt-2">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-gray-400 mt-1" />
                <span>
                  {request.location.latitude.toFixed(6)}, 
                  {request.location.longitude.toFixed(6)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Service Type</span>
            <span className="text-gray-600 capitalize">{request.serviceType}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total</span>
            <span>${request.price.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onBack}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Sign in to Continue
          </button>
        </div>
      </div>
    </div>
  );
}