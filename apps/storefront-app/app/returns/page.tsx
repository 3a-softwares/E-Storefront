'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faCheckCircle, faBoxOpen, faClock, faShieldAlt, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Button } from '3a-ecommerce-ui-library';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg mb-4">
              <FontAwesomeIcon icon={faUndo} className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 mb-4">
              Returns & Refunds
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Shop with confidence - we offer hassle-free returns and quick refunds
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl shadow-2xl p-8 mb-12 text-white text-center">
          <FontAwesomeIcon icon={faCheckCircle} className="w-16 h-16 mb-4" />
          <h2 className="text-3xl font-bold mb-3">30-Day Return Policy</h2>
          <p className="text-xl text-orange-100">
            Not satisfied? Return your items within 30 days for a full refund - no questions asked!
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Return an Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="inline-block p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Initiate Return</h3>
              <p className="text-sm text-gray-600">
                Log into your account and go to Orders. Select the item you want to return and click
                "Return Item".
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="inline-block p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Pack Your Item</h3>
              <p className="text-sm text-gray-600">
                Pack the item securely in its original packaging if possible. Include all
                accessories and documentation.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="inline-block p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Ship It Back</h3>
              <p className="text-sm text-gray-600">
                Use the prepaid return label we email you. Drop off at any authorized carrier
                location.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="inline-block p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl mb-4">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Get Refunded</h3>
              <p className="text-sm text-gray-600">
                Once we receive your return, we'll process your refund within 3-5 business days.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Policy Details</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-orange-600" />
                  Return Window
                </h3>
                <p className="text-sm ml-7">
                  You have 30 days from the delivery date to initiate a return. After 30 days, we
                  cannot accept returns, but warranty claims may still apply.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBoxOpen} className="w-5 h-5 text-orange-600" />
                  Item Condition
                </h3>
                <p className="text-sm ml-7">
                  Items must be unused, unworn, and in their original condition with all tags
                  attached. Products showing signs of use may not be eligible for return.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faShieldAlt} className="w-5 h-5 text-orange-600" />
                  Non-Returnable Items
                </h3>
                <p className="text-sm ml-7">
                  For hygiene reasons, certain items like cosmetics, underwear, earrings, and
                  perishable goods cannot be returned once opened.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 text-orange-600" />
                  Return Shipping
                </h3>
                <p className="text-sm ml-7">
                  We provide free return shipping labels for all US domestic returns. International
                  returns may require the customer to cover shipping costs.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Information</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-green-600" />
                  Processing Time
                </h3>
                <p className="text-sm ml-7">
                  Once we receive and inspect your return, we'll process your refund within 3-5
                  business days. You'll receive an email confirmation when the refund is issued.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 text-green-600" />
                  Refund Method
                </h3>
                <p className="text-sm ml-7">
                  Refunds are issued to the original payment method. Credit card refunds may take
                  5-10 business days to appear on your statement depending on your bank.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBoxOpen} className="w-5 h-5 text-green-600" />
                  Partial Refunds
                </h3>
                <p className="text-sm ml-7">
                  In some cases, partial refunds may be granted for items returned with obvious
                  signs of use, missing parts, or not in original condition.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faShieldAlt} className="w-5 h-5 text-green-600" />
                  Exchanges
                </h3>
                <p className="text-sm ml-7">
                  We don't offer direct exchanges. If you need a different size or color, please
                  return the original item for a refund and place a new order.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faBoxOpen} className="w-5 h-5 text-red-600" />
                Damaged or Defective Items
              </h3>
              <p className="text-sm text-gray-600">
                If you receive a damaged or defective item, contact us immediately with photos.
                We'll send a replacement or issue a full refund including return shipping costs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faBoxOpen} className="w-5 h-5 text-blue-600" />
                Wrong Item Received
              </h3>
              <p className="text-sm text-gray-600">
                If you received the wrong item, we apologize! Contact us and we'll arrange to send
                the correct item at no additional cost and provide a return label for the wrong
                item.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faBoxOpen} className="w-5 h-5 text-purple-600" />
                Missing Items
              </h3>
              <p className="text-sm text-gray-600">
                If your package is missing items from your order, please contact us within 48 hours
                of delivery. We'll investigate and send the missing items or issue a refund.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Need Help with a Return?</h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Our customer support team is here to assist you with any questions about returns or
            refunds.
          </p>
          <Button variant="secondary" size="lg" fullWidth={false}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
