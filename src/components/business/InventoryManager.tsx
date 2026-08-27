import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Plus, 
  Package, 
  AlertTriangle, 
  Download, 
  Search, 
  Edit3, 
  Trash2, 
  Boxes, 
  TrendingDown, 
  CheckCircle2 
} from 'lucide-react';
import { InventoryItem } from '../../types';

export const InventoryManager: React.FC = () => {
  const { 
    inventory, 
    addInventoryItem, 
    updateStock, 
    deleteInventoryItem, 
    exportInventoryToCSV, 
    setBusinessScreen,
    formatPrice,
    currency 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Item State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('Hair Care');
  const [brand, setBrand] = useState('L’Oréal Paris');
  const [stockQty, setStockQty] = useState(10);
  const [minThreshold, setMinThreshold] = useState(4);
  const [unit, setUnit] = useState('bottles');
  const [unitCostPrice, setUnitCostPrice] = useState(850);
  const [sellingPrice, setSellingPrice] = useState(1200);
  const [supplier, setSupplier] = useState('BeautyHub Supplies');

  const categories = ['All', 'Hair Care', 'Beard & Shave', 'Skin & Facial', 'Color & Spa', 'Equipment'];

  const filteredItems = inventory.filter(item => {
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const lowStockItems = inventory.filter(item => item.stockQty <= item.minThreshold);
  const totalStockValue = inventory.reduce((acc, item) => acc + item.stockQty * item.unitCostPrice, 0);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem({
      name,
      category,
      brand,
      stockQty: Number(stockQty) || 0,
      minThreshold: Number(minThreshold) || 1,
      unit,
      unitCostPrice: Number(unitCostPrice) || 0,
      sellingPrice: sellingPrice ? Number(sellingPrice) : undefined,
      supplier
    });

    setName('');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-full pb-24 bg-[#0A0A0F] text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBusinessScreen('dashboard')}
            className="w-8 h-8 rounded-full bg-[#181824] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-heading text-base font-bold text-white">
              Salon Stock & Inventory
            </h2>
            <p className="text-[10px] text-gold-400">Supplies & Retail Products ({currency.code})</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportInventoryToCSV}
            className="p-2 rounded-xl bg-[#161622] border border-white/10 hover:border-gold-400/40 text-gray-300 hover:text-gold-300 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Download CSV Spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="gold-gradient-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-3.5 rounded-2xl border border-gold-400/30">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
              Total Stock Valuation
            </span>
            <p className="text-lg font-black text-gold-400 font-heading mt-1">
              {formatPrice(totalStockValue)}
            </p>
            <span className="text-[10px] text-gray-400 mt-0.5 block">{inventory.length} Product SKUs</span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${
            lowStockItems.length > 0
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : 'glass-card border-white/10 text-gray-300'
          }`}>
            <span className="text-[10px] uppercase tracking-wider block font-semibold">
              Low Stock Alerts
            </span>
            <p className="text-lg font-black font-heading mt-1 flex items-center gap-1.5">
              {lowStockItems.length > 0 && <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />}
              {lowStockItems.length} Items Need Reorder
            </p>
            <span className="text-[10px] opacity-80 block">Below min threshold</span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by SKU name or brand..."
              className="w-full bg-[#181824] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCat(c)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap border transition-all ${
                  selectedCat === c
                    ? 'bg-gold-400 text-black border-gold-400 font-bold'
                    : 'bg-[#181824] text-gray-400 border-white/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="glass-card p-8 rounded-3xl text-center space-y-3 my-4 border border-white/5">
              <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mx-auto text-gold-400">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-sm font-bold text-white">No Inventory SKUs Tracked</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Track hair color tubes, shampoos, styling waxes, and salon supplies with real-time low-stock alerts.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold shadow-sm mt-2 inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Product SKU</span>
              </button>
            </div>
          ) : (
            filteredItems.map(item => {
            const isLow = item.stockQty <= item.minThreshold;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isLow
                    ? 'bg-gradient-to-r from-[#2B1518] to-[#161622] border-red-500/40'
                    : 'glass-card border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isLow ? 'bg-red-500/20 text-red-400' : 'bg-gold-400/10 text-gold-400'
                    }`}>
                      <Package className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading text-xs font-bold text-white">
                          {item.name}
                        </h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono">
                          {item.brand}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                        <span>Cost: {formatPrice(item.unitCostPrice)}</span>
                        {item.sellingPrice && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400">Retail: {formatPrice(item.sellingPrice)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteInventoryItem(item.id)}
                    className="text-gray-500 hover:text-red-400 p-1"
                    title="Delete SKU"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Stock Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Available Quantity</span>
                    <span className={`font-bold ${isLow ? 'text-red-400' : 'text-white'}`}>
                      {item.stockQty} {item.unit} {isLow && '(Reorder Alert)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#12121A] border border-white/10 rounded-xl p-1">
                    <button
                      onClick={() => updateStock(item.id, item.stockQty - 1)}
                      className="w-7 h-7 rounded-lg bg-[#1C1C2A] text-gray-300 hover:bg-gold-400 hover:text-black font-bold flex items-center justify-center text-xs transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-white text-xs">
                      {item.stockQty}
                    </span>
                    <button
                      onClick={() => updateStock(item.id, item.stockQty + 1)}
                      className="w-7 h-7 rounded-lg bg-[#1C1C2A] text-gray-300 hover:bg-gold-400 hover:text-black font-bold flex items-center justify-center text-xs transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141E] border border-gold-400/30 rounded-2xl w-full max-w-sm p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white">
                Add Inventory Product
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Product / Supply Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Keratin Shampoo 500ml"
                  required
                  className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Hair Care">Hair Care</option>
                    <option value="Beard & Shave">Beard & Shave</option>
                    <option value="Skin & Facial">Skin & Facial</option>
                    <option value="Color & Spa">Color & Spa</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={stockQty}
                    onChange={e => setStockQty(Number(e.target.value))}
                    className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">Min Alert Qty</label>
                  <input
                    type="number"
                    value={minThreshold}
                    onChange={e => setMinThreshold(Number(e.target.value))}
                    className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 mb-1">Cost Price ({currency.symbol})</label>
                  <input
                    type="number"
                    value={unitCostPrice}
                    onChange={e => setUnitCostPrice(Number(e.target.value))}
                    className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">Selling Price ({currency.symbol})</label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={e => setSellingPrice(Number(e.target.value))}
                    className="w-full bg-[#181824] border border-[#2B2B3E] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="gold-gradient-btn w-full py-3 rounded-xl text-xs font-bold mt-2"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
